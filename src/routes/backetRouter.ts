import { BacketController } from "@controller";
import { verifyToken } from "@middlewares";
import { Router } from "express";

const backetRouter: Router = Router()

backetRouter.post("/basket/create", verifyToken(), BacketController.createBasket)
backetRouter.get("/basket/getAll",  BacketController.getAllBasket)
backetRouter.patch("/basket/update/:id", verifyToken(), BacketController.updateBasket)
backetRouter.delete("/basket/delete/:id", verifyToken(), BacketController.deleteBasket)

export { backetRouter }