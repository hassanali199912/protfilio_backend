import express from "express";
import { body } from "express-validator";
import { spawn } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";
import OpenAI from "openai";

import ResponseHandler from "../utils/ResponseHandler.js";
import BaseCRUD from "../generics/Base-crud.js";
import validationHandlerMiddleware from "../middlewares/ValidationHandlerMiddelware.js";
import SkillsModel from "../models/skills.js";
import ContentModel from "../models/ProfileContent.js";
import ExperienceModel from "../models/experience.js";
import GlobalModel from "../models/globalSetting.js";

const router = express.Router();

const TEX_MAX_BYTES = 500 * 1024;
const LATEX_TIMEOUT_MS = 30_000;
const ALLOWED_ENGINES = new Set(["pdflatex", "xelatex"]);
const LOG_TAIL_CHARS = 2000;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

const SYSTEM_PROMPT = `You tailor a CV summary and cover letter from the profile JSON only.
Respond with a JSON object and no other text.

Rules:
- Use only facts in the profile JSON. Do not invent employers, dates, projects, or skills.
- skills must be copied from skillNames. Do not add tools that are not in that list.
- summary rewrites profile.about for this job. It may emphasize matching experience. It must not add employers, dates, or projects that are not in experience.
- coverLetter is the letter body only, addressed to companyName for jobTitle. No subject line and no LaTeX.
- requiredSkills is what the job description asks for, even if the user does not have them.
- Keys: summary (string), skills (array of strings), requiredSkills (array of strings), coverLetter (string).`;

const analyzeValidation = [
  body("jobTitle").trim().notEmpty().withMessage("Job title is required").bail().isString(),
  body("companyName").trim().notEmpty().withMessage("Company name is required").bail().isString(),
  body("jobDescription")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .bail()
    .isString(),
];

const compileValidation = [
  body("tex")
    .isString()
    .withMessage("tex must be a string")
    .bail()
    .custom((value) => {
      if (!value.trim()) {
        throw new Error("tex is required");
      }
      if (Buffer.byteLength(value, "utf8") > TEX_MAX_BYTES) {
        throw new Error("tex must be 500 KB or smaller");
      }
      return true;
    }),
  body("filename")
    .isIn(["cv", "cover-letter"])
    .withMessage("filename must be cv or cover-letter"),
];

function normalizeSkill(name) {
  return String(name).trim().toLowerCase();
}

function parseModelJson(content) {
  const text = String(content || "").trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("The model did not return JSON");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

async function loadProfileContext() {
  const skillsCrud = new BaseCRUD(SkillsModel);
  const contentCrud = new BaseCRUD(ContentModel);
  const experienceCrud = new BaseCRUD(ExperienceModel);
  const globalCrud = new BaseCRUD(GlobalModel);

  const [skills, contentList, experience, globalList] = await Promise.all([
    skillsCrud.filterBy({ isVisible: true }, { name: 1, _id: 0 }),
    contentCrud.filterBy(
      {},
      {
        "hero.title.en": 1,
        "hero.description.en": 1,
        "about.description.en": 1,
        _id: 0,
      }
    ),
    experienceCrud.filterBy(
      { isVisible: true },
      {
        type: 1,
        date: 1,
        order: 1,
        "title.en": 1,
        "shortDescription.en": 1,
        _id: 0,
      }
    ),
    globalCrud.filterBy({}, { "contact.email": 1, "contact.phone": 1, _id: 0 }),
  ]);

  const content = contentList[0];
  const globalDoc = globalList[0];

  return {
    skillNames: skills
      .map((skill) => skill.name)
      .filter((name) => typeof name === "string" && name.trim())
      .map((name) => name.trim()),
    profile: content
      ? {
          name: content.hero?.title?.en || "",
          heroDescription: content.hero?.description?.en || "",
          about: content.about?.description?.en || "",
        }
      : null,
    experience: [...experience]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((row) => ({
        type: row.type,
        date: row.date,
        title: row.title?.en || "",
        shortDescription: row.shortDescription?.en || "",
      })),
    contact: {
      email: globalDoc?.contact?.email || "",
      phone: globalDoc?.contact?.phone || "",
    },
  };
}

function guardSkills(parsed, skillNames) {
  const savedByNorm = new Map(skillNames.map((name) => [normalizeSkill(name), name]));
  const skills = [];
  const seenSkills = new Set();

  for (const item of parsed.skills) {
    if (typeof item !== "string") continue;
    const canonical = savedByNorm.get(normalizeSkill(item));
    if (!canonical || seenSkills.has(canonical)) continue;
    seenSkills.add(canonical);
    skills.push(canonical);
  }

  const requiredSkills = [];
  const seenRequired = new Set();
  for (const item of parsed.requiredSkills) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    const norm = normalizeSkill(trimmed);
    if (!norm || seenRequired.has(norm)) continue;
    seenRequired.add(norm);
    requiredSkills.push(trimmed);
  }

  const savedNorms = new Set(skillNames.map(normalizeSkill));
  const missingSkills = requiredSkills.filter(
    (skill) => !savedNorms.has(normalizeSkill(skill))
  );

  return {
    summary: parsed.summary.trim(),
    skills,
    requiredSkills,
    missingSkills,
    coverLetter: parsed.coverLetter.trim(),
  };
}

async function analyzeJob(req, res) {
  const response = new ResponseHandler(res);

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return response.error("OPENROUTER_API_KEY is not configured", 500);
    }

    const context = await loadProfileContext();
    if (!context.profile) {
      return response.error("Profile content was not found", 400);
    }
    if (context.skillNames.length === 0) {
      return response.error("No visible skills are saved", 400);
    }

    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: OPENROUTER_BASE_URL,
      defaultHeaders: {
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:5001",
        "X-Title": "Portfolio CV",
      },
    });
    const completion = await client.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            jobTitle: req.body.jobTitle,
            companyName: req.body.companyName,
            jobDescription: req.body.jobDescription,
            profile: context.profile,
            experience: context.experience,
            contact: context.contact,
            skillNames: context.skillNames,
          }),
        },
      ],
    });

    let parsed;
    try {
      parsed = parseModelJson(completion.choices?.[0]?.message?.content);
    } catch {
      return response.error("The analysis response could not be read", 502);
    }

    if (
      typeof parsed?.summary !== "string" ||
      !parsed.summary.trim() ||
      typeof parsed?.coverLetter !== "string" ||
      !parsed.coverLetter.trim() ||
      !Array.isArray(parsed?.skills) ||
      !Array.isArray(parsed?.requiredSkills)
    ) {
      return response.error("The analysis response could not be read", 502);
    }

    return response.success(guardSkills(parsed, context.skillNames), "Job analyzed successfully");
  } catch (error) {
    console.error(error);
    return response.error("Job analysis failed", 502);
  }
}

function engineCommand(engine) {
  if (process.platform === "win32") return `${engine}.exe`;
  return engine;
}

function runLatex(engine, cwd, texFile) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      engineCommand(engine),
      ["-interaction=nonstopmode", "-halt-on-error", texFile],
      { cwd, shell: false }
    );

    let settled = false;
    const finish = (handler, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      handler(value);
    };

    const timer = setTimeout(() => {
      child.kill();
      const error = new Error("LaTeX timed out");
      error.statusCode = 422;
      finish(reject, error);
    }, LATEX_TIMEOUT_MS);

    child.on("error", (error) => finish(reject, error));
    child.on("close", (code) => {
      if (code === 0) {
        finish(resolve);
        return;
      }
      const error = new Error(`LaTeX exited with code ${code}`);
      error.statusCode = 422;
      finish(reject, error);
    });
  });
}

async function readLogTail(dir, filename) {
  try {
    const log = await fs.readFile(path.join(dir, `${filename}.log`), "utf8");
    return log.slice(-LOG_TAIL_CHARS);
  } catch {
    return "";
  }
}

async function compileTex(tex, filename) {
  const engine = process.env.LATEX_ENGINE || "pdflatex";
  if (!ALLOWED_ENGINES.has(engine)) {
    const error = new Error("LATEX_ENGINE must be pdflatex or xelatex");
    error.statusCode = 500;
    error.publicMessage = error.message;
    throw error;
  }

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cv-"));
  try {
    await fs.writeFile(path.join(dir, `${filename}.tex`), tex, "utf8");
    try {
      await runLatex(engine, dir, `${filename}.tex`);
    } catch (error) {
      if (error.code === "ENOENT") {
        error.statusCode = 500;
        error.publicMessage = `${engine} was not found on PATH. Install MiKTeX or TeX Live and run this server on this PC.`;
      } else if (!error.statusCode) {
        error.statusCode = 422;
      }
      error.logTail = await readLogTail(dir, filename);
      throw error;
    }

    try {
      return await fs.readFile(path.join(dir, `${filename}.pdf`));
    } catch (error) {
      error.statusCode = 422;
      error.logTail = await readLogTail(dir, filename);
      throw error;
    }
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

async function compilePdf(req, res) {
  const response = new ResponseHandler(res);

  try {
    const pdf = await compileTex(req.body.tex, req.body.filename);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${req.body.filename}.pdf"`);
    res.status(200).send(pdf);
  } catch (error) {
    console.error(error);
    const statusCode = error.statusCode || 500;
    if (statusCode === 422) {
      return response.error("LaTeX compilation failed", 422, error.logTail || "");
    }
    return response.error(error.publicMessage || "PDF compilation failed", statusCode);
  }
}

router.post("/analyze", analyzeValidation, validationHandlerMiddleware, analyzeJob);
router.post("/compile", compileValidation, validationHandlerMiddleware, compilePdf);

export default router;
