import express from "express";


const indexRoute = express.Router();

/*======================= Users Routes =================================== */
import sectionsRoutes from "../main-routes/sections.js";
indexRoute.use("/sections", sectionsRoutes);
/*======================= Users Routes =================================== */






/*======================= Users Routes =================================== */
import userRoutes from "../main-routes/userBasicRoutes.js";
indexRoute.use("/users", userRoutes);
/*======================= Users Routes =================================== */

/*======================= Hero Section Routes =================================== */
import heroSection from "../main-routes/heroSectionRoutes.js";
import statesRoutes from "../main-routes/statesRoutes.js";
indexRoute.use("/hero", heroSection);
indexRoute.use("/hero-state", statesRoutes);
/*=======================  Hero Section Routes =================================== */

/*======================= About Section Routes =================================== */
import aboutSection from "../main-routes/aboutSectionRoutes.js"
import socialMedia from "../main-routes/socialMedaiRoutes.js"
indexRoute.use("/about", aboutSection);
indexRoute.use("/about-social", socialMedia);
/*=======================  About Section Routes =================================== */

/*======================= Work Process Section Routes =================================== */
import workProcessSection from "../main-routes/workProcess.Section.js"
indexRoute.use("/work-process", workProcessSection);
/*=======================  Work Process Section Routes =================================== */

/*======================= Portfolio Section Routes =================================== */
import portfolioSection from "../main-routes/portfolioSectionRoutes.js"
indexRoute.use("/portfolio", portfolioSection);
/*=======================  Portfolio Section Routes =================================== */

/*======================= Contact Us Section Routes =================================== */
import messageRoutes from "../main-routes/messageRoutes.js"
indexRoute.use("/message", messageRoutes);
/*=======================  Contact Us Section Routes =================================== */


export default indexRoute;