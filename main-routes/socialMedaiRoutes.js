import SocialMediaModel from "../models/socialMedia.js"
import BaseCRUD from "../generics/Base-crud.js"
import BaseController from "../generics/Base-Controller.js"
import BaseRouters from "../generics/Base-Routes.js"

const objectCrud = new BaseCRUD(SocialMediaModel);
const objectController = new BaseController(objectCrud);
const objectRoutes = new BaseRouters(objectController);

export default objectRoutes.getRouter()



