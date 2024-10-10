import { OrderController } from "@controller";
import { verifyToken } from "@middlewares";
import { Router } from "express";

const orderRouter: Router = Router()

orderRouter.post("/order/create/:id", verifyToken(), OrderController.createOrder)
orderRouter.get("/order/getAll", OrderController.getAllOrder)
orderRouter.get("/order/getMeOrder", verifyToken(), OrderController.getAllMeOrder)

export { orderRouter }