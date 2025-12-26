import { validationResult } from "express-validator";
import ResponseHandler from "../utils/ResponseHandler.js";

const validationHandlerMiddleware = (req, res, next) => {
  const responseHandler = new ResponseHandler(res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responseHandler.error(errors.array(), 400);
  }
  next();
};

export default validationHandlerMiddleware

