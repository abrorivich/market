import { ErrorHandler } from "@error"
import { basket, PrismaClient, users } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

let client = new PrismaClient

export class BacketController {
    static async createBasket(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [admin]: users[] = await client.users.findMany({ where: { id } })
            if (admin) {
                let { userId, bookId }: Omit<basket, "id"> = req.body
                let [userCheck] = await client.users.findMany({ where: { id: userId } })
                if (userCheck) {
                    let [booksCheck] = await client.books.findMany({ where: { id: bookId } })
                    if (booksCheck) {
                        let userBook: basket = await client.basket.create({ data: { userId, bookId } })
                        res.status(200).send({
                            succes: true,
                            message: "👌🏻",
                            data: userBook
                        })
                    } else {
                        res.status(404).send({
                            success: false,
                            message: "Not found book"
                        })
                    }
                } else {
                    res.status(404).send({
                        success: false,
                        message: "Not found user"
                    })
                }
            } else {
                res.send({
                    success: false,
                    message: "Admin not found"
                })
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getAllBasket(req: Request, res: Response, next: NextFunction) {
        try {
            let backet: basket[] = await client.basket.findMany({ include: { users: { select: { fullname: true } }, books: { select: { title: true, author: true, price: true } } } })
            res.status(200).send({
                succes: true,
                data: backet
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async updateBasket(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [admin] = await client.users.findMany({ where: { id } })
            if (admin.isAdmin == true) {
                let { id }: Partial<basket> = req.params
                let backetCheck = await client.books.findUnique({ where: { id: Number(id) } })
                if (backetCheck) {
                    let { userId, bookId }: Omit<basket, "id"> = req.body
                    let basket: basket = await client.basket.update({ where: { id: Number(id) }, data: { userId, bookId } })
                    res.status(200).send({
                        succes: true,
                        message: "update books 👌🏻",
                        data: basket
                    })
                } else {
                    res.send({
                        message: "Books not found ❌"
                    })
                }
            } else {
                res.send({
                    message: "You not admin ❌"
                })
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async deleteBasket(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [admin] = await client.users.findMany({ where: { id } })
            if (admin.isAdmin == true) {
                let { id }: Partial<basket> = req.params
                let [basketCheck] = await client.basket.findMany({ where: { id: Number(id) } })
                if (basketCheck) {
                    await client.basket.delete({ where: { id: Number(id) } })
                    res.status(200).send({
                        succes: true,
                        message: "delete books 🛒",
                    })
                } else {
                    res.send({
                        succes: false,
                        message: "Basket not found ❌"
                    })
                }
            } else {
                res.send({
                    message: "You not admin ❌"
                })
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}