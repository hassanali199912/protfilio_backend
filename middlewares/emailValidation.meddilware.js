import UserModule from "../models/users.js";
import ResponseHandler from "../utils/ResponseHandler.js";
import BASIC_CRUD from "../generics/Base-crud.js";

const checkEmailExists = async (req, res, next) => {
  const responseHandler = new ResponseHandler(res);
  const CrudModule = new BASIC_CRUD(UserModule);

  try {
    const { email } = req.body;

    if (!email) {
      return responseHandler.error("Email is required", 400);
    }

    const existingUser = await CrudModule.filterBy({
      email: email.toLowerCase(),
    });

    if (existingUser && existingUser.length > 0) {
      return responseHandler.error("Email already exists", 400);
    }

    next();
  } catch (error) {
    return responseHandler.error(error.message, 500, error);
  }
};

const checkEmailNotExists = async (req, res, next) => {
  const responseHandler = new ResponseHandler(res);
  const CrudModule = new BASIC_CRUD(UserModule);

  try {
    const { email } = req.body;

    if (!email) {
      return responseHandler.error("Email is required", 400);
    }

    const existingUser = await CrudModule.filterBy({
      email: email.toLowerCase(),
    });

    if (!existingUser || existingUser.length === 0) {
      return responseHandler.notFound("Email not found");
    }

    next();
  } catch (error) {
    return responseHandler.error(error.message, 500, error);
  }
};

export {
  checkEmailExists,
  checkEmailNotExists,
}
