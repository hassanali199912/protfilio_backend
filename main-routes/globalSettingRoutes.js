import GlobalSettingModel from "../models/globalSetting.js"
import BaseCRUD from "../generics/Base-crud.js"
import BaseController from "../generics/Base-Controller.js"
import BaseRouters from "../generics/Base-Routes.js"

const objectCrud = new BaseCRUD(GlobalSettingModel);
const objectController = new BaseController(objectCrud);
const objectRoutes = new BaseRouters(objectController);

export default objectRoutes.getRouter()



