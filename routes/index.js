import express from "express";

const indexRoute = express.Router();

/*======================= Users Routes =================================== */
import sectionsRoutes from "../main-routes/sections.js";
indexRoute.use("/sections", sectionsRoutes);
/*======================= Users Routes =================================== */

/*======================= Users Routes =================================== */
import GlobalRoutes from "../main-routes/globalSettingRoutes.js";
indexRoute.use("/global", GlobalRoutes);
/*======================= Users Routes =================================== */

/*======================= Users Routes =================================== */
import SocialMediaRoutes from "../main-routes/socialMedaiRoutes.js";
indexRoute.use("/social", SocialMediaRoutes);
/*======================= Users Routes =================================== */

/*======================= Hero Section Routes =================================== */
import profileContent from "../main-routes/profileContentRoutes.js";
import statesRoutes from "../main-routes/statesRoutes.js";
indexRoute.use("/profile-content", profileContent);
indexRoute.use("/hero-state", statesRoutes);
/*=======================  Hero Section Routes =================================== */

/*======================= Portfolio Section Routes =================================== */
import portfolioSection from "../main-routes/portfolioSectionRoutes.js";
indexRoute.use("/portfolio", portfolioSection);
/*=======================  Portfolio Section Routes =================================== */

/*======================= Skills Section Routes =================================== */
import skillSection from "../main-routes/skills.js";
indexRoute.use("/skills", skillSection);
/*=======================  Skills Section Routes =================================== */

/*======================= Users Routes =================================== */
import userRoutes from "../main-routes/userBasicRoutes.js";
indexRoute.use("/users", userRoutes);
/*======================= Users Routes =================================== */

/*======================= Work Process Section Routes =================================== */
import workProcessSection from "../main-routes/workProcess.Section.js";
indexRoute.use("/work-process", workProcessSection);
/*=======================  Work Process Section Routes =================================== */

/*======================= Contact Us Section Routes =================================== */
import messageRoutes from "../main-routes/messageRoutes.js";
indexRoute.use("/message", messageRoutes);
/*=======================  Contact Us Section Routes =================================== */

export default indexRoute;
