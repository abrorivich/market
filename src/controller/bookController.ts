import { ErrorHandler } from "@error";
import { books, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

let client = new PrismaClient()

export class BookController {
    static async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [admin] = await client.users.findMany({ where: { id } })
            if (admin.isAdmin == true) {
                let { title, author, price }: Omit<books, "id"> = req.body
                let book: books = await client.books.create({ data: { title, author, price } })
                res.status(200).send({
                    succes: true,
                    message: "created books 👌🏻",
                    data: book
                })
            } else {
                res.send({
                    message: "You not admin ❌"
                })
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getAllBook(req: Request, res: Response, next: NextFunction) {
        try {
            let book: books[] = await client.books.findMany({ include: { basket: { select: { users: { select: { fullname: true, email: true } } } } } })
            res.status(200).send({
                succes: true,
                data: book
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getByIdBook(req: Request, res: Response, next: NextFunction) {
        try {
            let { id }: Partial<books> = req.params
            let book = await client.books.findUnique({ where: { id: Number(id) }, include: { basket: { select: { users: { select: { fullname: true, email: true } } } } } })
            res.status(200).send({
                succes: true,
                data: book
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [admin] = await client.users.findMany({ where: { id } })
            if (admin.isAdmin == true) {
                let { id }: Partial<books> = req.params
                let bookCheck = await client.books.findUnique({ where: { id: Number(id) } })
                if (bookCheck) {
                    let { title, author, price }: Omit<books, "id"> = req.body
                    let books: books = await client.books.update({ where: { id: Number(id) }, data: { title, author, price } })
                    res.status(200).send({
                        succes: true,
                        message: "update books 👌🏻",
                        data: books
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

    static async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [admin] = await client.users.findMany({ where: { id } })
            if (admin.isAdmin == true) {
                let { id }: Partial<books> = req.params
                let [bookCheck] = await client.books.findMany({ where: { id: Number(id) } })
                if (bookCheck) {
                    await client.books.delete({ where: { id: Number(id) } })
                    res.status(200).send({
                        succes: true,
                        message: "delete books 🛒",
                    })
                } else {
                    res.send({
                        succes: false,
                        message: "Book not found ❌"
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

    static async searchBook(req: Request, res: Response, next: NextFunction) {
        try {
            let { title }: Partial<books> = req.body
            let books: books[] = await client.books.findMany({
                where: {
                    OR: [
                        { title: { startsWith: title, mode: 'insensitive' } },
                    ]
                },
                include: { basket: { select: { users: { select: { fullname: true, email: true } } } } }
            })
            res.status(200).send({
                succes: true,
                data: books
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}