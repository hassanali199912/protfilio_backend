import { body } from "express-validator";
import MessageModel from "../models/messages.js";
import BaseCRUD from "../generics/Base-crud.js";
import BaseController from "../generics/Base-Controller.js";
import BaseRouters from "../generics/Base-Routes.js";
import validationHandlerMiddleware from "../middlewares/ValidationHandlerMiddelware.js";

const messageCreateValidation = [
    body("name").trim().notEmpty().withMessage("Name is required").bail().isString(),
    body("whatsapp")
        .trim()
        .notEmpty()
        .withMessage("WhatsApp is required")
        .bail()
        .matches(/^\+?[0-9][0-9\s-]{7,19}$/)
        .withMessage("WhatsApp must be a valid phone number"),
    body("budget").trim().notEmpty().withMessage("Budget is required").bail().isString(),
    body("message").trim().notEmpty().withMessage("Message is required").bail().isString(),
];

const objectCrud = new BaseCRUD(MessageModel);
const objectController = new BaseController(objectCrud);

class MessageRoutes extends BaseRouters {
    mainRoutes() {
        this.router.post(
            "/",
            messageCreateValidation,
            validationHandlerMiddleware,
            (req, res) => this.controller.create(req, res)
        );
        super.mainRoutes();
    }
}

const objectRoutes = new MessageRoutes(objectController);

export default objectRoutes.getRouter();
