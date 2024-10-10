import { UserController } from "@controller";
import { verifyToken } from "@middlewares";
import { Router } from "express";
import passport from "passport";

const userRouter: Router = Router()

userRouter.get("/auth/github/login", UserController.loginGithub)
userRouter.get("/auth/callback", passport.authenticate("github"), UserController.CallbackGithub)
userRouter.get("/auth/github/getAll", UserController.getAllUser)
userRouter.get("/auth/github/getMe", verifyToken(), UserController.getMeUser)
userRouter.post("/user/admin/create",  UserController.admin)
userRouter.get("/user/admin/login",  UserController.tokenGenerate)

export { userRouter }