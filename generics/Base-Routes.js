import express from "express";

class BaseRouters {
    constructor(controller) {
        this.router = express.Router();
        this.controller = controller;
        this.mainRoutes();
    }

    mainRoutes() {
        this.router.get("/", (req, res) => this.controller.getAll(req, res));
        this.router.get("/filter", (req, res) => this.controller.filter(req, res));
        this.router.get("/:id", (req, res) => this.controller.getById(req, res));
        this.router.get("/visible/:id", (req, res) => this.controller.changeVisible(req, res));

        this.router.post("/", (req, res) => this.controller.create(req, res));
        this.router.post("/many", (req, res) => this.controller.createMany(req, res));
        this.router.put("/:id", (req, res) => this.controller.update(req, res));
        this.router.delete("/:id", (req, res) => this.controller.delete(req, res));
    }

    getRouter() {
        return this.router;
    }

}

export default BaseRouters;