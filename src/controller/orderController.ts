import { ErrorHandler } from "@error";
import { basket, order, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

let client = new PrismaClient()

export class OrderController {
    static async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [admin] = await client.users.findMany({ where: {id},include: { basket: { select: { books: { select: { title: true, author: true, price: true } } } } }})
            if (admin) {
                let {id}: Partial<basket> = req.params
                let [basket] = await client.basket.findMany({ where: {id: Number(id)}})
                if (admin.id == basket.userId) {
                    let [bookPoisk] = await client.books.findMany({where: {id: basket.bookId}})
                    let order: order = await client.order.create({ data: { name: admin.fullname as string, book: bookPoisk.title, createdAt: new Date() } })                    
                    await client.basket.delete({where: {id: Number(id)}})
                    res.status(200).send({
                        succes: true,
                        message: "Create order 👌🏻",
                        data: order
                    })
                } else {
                    res.send({
                        message: "Bu sizning savatingiz emas ❌"
                    })
                }
            } else {
                res.send({
                    message: "You not user ❌"
                })
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getAllOrder(req: Request, res: Response, next: NextFunction) {
        try {
            let order: order[] = await client.order.findMany()
            res.status(200).send({
                succes: true,
                data: order
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getAllMeOrder(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [admin] = await client.users.findMany({ where: {id},include: { basket: { select: { books: { select: { title: true, author: true, price: true } } } } }})
            let order: order[] = await client.order.findMany({where: {name: admin.fullname as string}})
            res.status(200).send({
                succes: true,
                data: order
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}