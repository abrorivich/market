import { BookController } from "@controller";
import { verifyToken } from "@middlewares";
import { Router } from "express";

const bookRouter: Router = Router()

bookRouter.post("/gyms/create", verifyToken(), BookController.createBook)
bookRouter.get("/gyms/getAll", BookController.getAllBook)
bookRouter.get("/gyms/getById/:id", BookController.getByIdBook)
bookRouter.patch("/gyms/update/:id", verifyToken(), BookController.updateBook)
bookRouter.delete("/gyms/delete/:id", verifyToken(), BookController.deleteBook)
bookRouter.get("/gyms/search", BookController.searchBook)

export { bookRouter }