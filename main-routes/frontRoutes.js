import express from "express";
import ResponseHandler from "../utils/ResponseHandler.js";
import BaseCRUD from "../generics/Base-crud.js";
import SectionsModel from "../models/sections.js";
import ContentModel from "../models/ProfileContent.js";
import ExperienceModel from "../models/experience.js";
import GlobalModel from "../models/globalSetting.js";
import PortfolioModel from "../models/portfilioSection.js";
import SkillsModel from "../models/skills.js";
import socialMediaModel from "../models/socialMedia.js";
import statesModel from "../models/states.js";
import workModel from "../models/workSection.js";

class FrontController {
  async FrontData(req, res) {
    const response = new ResponseHandler(res);
    const SectionModelObject = new BaseCRUD(SectionsModel);
    const ContentModelObject = new BaseCRUD(ContentModel);
    const ExperienceModelObject = new BaseCRUD(ExperienceModel);
    const GlobalSittingModelObject = new BaseCRUD(GlobalModel);
    const PortfolioModelObject = new BaseCRUD(PortfolioModel);
    const SkillsModelObject = new BaseCRUD(SkillsModel);
    const socialModelObject = new BaseCRUD(socialMediaModel);
    const stateModelObject = new BaseCRUD(statesModel);
    const workModelObject = new BaseCRUD(workModel);
    try {
      const hiddenFields = { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 };
      const filterByObject = { isVisible: true };
      const allSections = await SectionModelObject.filterBy(
        { ...filterByObject },
        { ...hiddenFields },
      );
      const allContent = await ContentModelObject.filterBy(
        {},
        { ...hiddenFields },
      );
      const allExperience = await ExperienceModelObject.filterBy(
        { ...filterByObject },
        { ...hiddenFields },
      );
      const allGlobalSitting = await GlobalSittingModelObject.filterBy(
        {},
        { ...hiddenFields },
      );
      const allPortfolio = await PortfolioModelObject.filterBy(
        { ...filterByObject },
        { ...hiddenFields },
      );
      const allSkills = await SkillsModelObject.filterBy(
        { ...filterByObject },
        { ...hiddenFields },
      );
      const allSocial = await socialModelObject.filterBy(
        { ...filterByObject },
        { ...hiddenFields },
      );
      const allStatus = await stateModelObject.filterBy({}, {});
      const allWork = await workModelObject.filterBy({}, {});

      response.success(
        {
          sections: allSections,
          content: allContent,
          global: allGlobalSitting,
          social: allSocial,
          experience: allExperience,
          skills: allSkills,
          portfolio: allPortfolio,
          // no data
          status: allStatus,
          work: allWork,
        },
        "Record created successfully",
        201,
      );
    } catch (error) {
      console.log(error);

      response.validationError(error.message);
    }
  }
}

class FrontRoutes {
  constructor(controller) {
    this.router = express.Router();
    this.controller = controller;
    this.mainRoutes();
  }

  mainRoutes() {
    this.router.get("/", (req, res) => this.controller.FrontData(req, res));
  }

  getRouter() {
    return this.router;
  }
}

const objectController = new FrontController();
const objectRoutes = new FrontRoutes(objectController);

export default objectRoutes.getRouter();
