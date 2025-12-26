import userModule from "../models/users.js";

import userBasicCrud from "../generics/Base-crud.js";
import userBasicControllers from "../generics/Base-Controller.js";
import BaseRouters from "../generics/Base-Routes.js";
import ResponseHandler from "../utils/ResponseHandler.js";


// Middleware For Protected Routes
import checkToken from "../middlewares/CheckToken.middleware.js";
import isAdmin from "../middlewares/IsAdmin.middleware.js";
import {
  userLoginValidation,
  userCreateValidation,
  userUpdateValidation,
} from "../middlewares/user.dataValidation.middleware.js";
import validationHandlerMiddleware from "../middlewares/ValidationHandlerMiddelware.js";
import {
  checkEmailNotExists,
  checkEmailExists,
} from "../middlewares/emailValidation.meddilware.js";

const userBasicCrudObject = new userBasicCrud(userModule);
class UserControllerCustom extends userBasicControllers {
  constructor(controller) {
    super(controller);
  }

  async login(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const { username, password } = req.body;
      const user = await userBasicCrudObject.filterBy({ username: username });
      if (user.length === 0) {
        return responseHandler.notFound("User not found");
      }

      const userData = await userBasicCrudObject.getById(user[0]._id);
      const isMatch = await userData.comparePassword(password);
      if (!isMatch) {
        return responseHandler.error("Invalid credentials", 401);
      }
      const token = await userData.generateToken();
      return responseHandler.success(
        {
          token: token,
          role: userData.role === "CODEMODE" ? "ADMIN" : "USER",
          email: userData.email,
          fname: userData.fname,
          lname: userData.lname,
        },
        "Login successful",
        200
      );
    } catch (error) {
      return responseHandler.error(error.message, 500, error);
    }
  }
}

class UserRoutesCustom extends BaseRouters {

  constructor(controller) {
    super(controller);
  }

  mainRoutes() {
    this.requiredValidationsRoutes();
    this.protectedRoutes();
    super.mainRoutes();
  }

  // This is a Protected Routes Authorized By Admin
  protectedRoutes() {
    this.router.post(
      "/",
      checkToken,
      isAdmin,
      userCreateValidation,
      validationHandlerMiddleware,
      checkEmailExists,
      (req, res) => this.controller.create(req, res)
    );

    // for Update User by Admin only
    this.router.put(
      "/:id",
      checkToken,
      isAdmin,
      userUpdateValidation,
      validationHandlerMiddleware,
      checkEmailNotExists,
      (req, res) => this.controller.update(req, res)
    );

    // for Delete User by Admin only
    this.router.delete("/:id", checkToken, isAdmin, (req, res) =>
      this.controller.delete(req, res)
    );
  }

  requiredValidationsRoutes() {
    this.router.post(
      "/login",
      userLoginValidation,
      validationHandlerMiddleware,
      checkEmailNotExists,
      (req, res) => this.controller.login(req, res)
    );
  }
}

const userBasicControllersObject = new UserControllerCustom(
  userBasicCrudObject
);
const userBasicRoutesObject = new UserRoutesCustom(userBasicControllersObject);






export default userBasicRoutesObject.getRouter();
