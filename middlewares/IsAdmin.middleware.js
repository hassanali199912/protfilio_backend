import UserModule from "../models/users.js";
import ResponseHandler from "../utils/ResponseHandler.js";
import BASIC_CRUD from "../generics/Base-crud.js";



const isAdmin = async (req, res, next) => {

    const responseHandler = new ResponseHandler(res);
    const CrudModule = new BASIC_CRUD(UserModule)
    try {

        const userId = req.userId
        const userData = await CrudModule.getById(userId);
        if (!userData) {
            return responseHandler.notFound("User not found");
        }
        if (userData.role !== "CODEMODE") {
            return responseHandler.error("Unauthorized", 401);
        }

        next();

    } catch (error) {

        return responseHandler.error(error.message, 500, error);
    }

}

export default isAdmin
