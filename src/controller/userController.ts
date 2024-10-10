import { ErrorHandler } from "@error";
import { basket, PrismaClient, users, } from "@prisma/client";
import { sign, verify } from "@utils";
import { NextFunction, Request, Response } from "express";
import passport from "passport";

let client = new PrismaClient

export class UserController {
    static async loginGithub(req: Request, res: Response, next: NextFunction) {
        try {
            passport.authenticate("github", {
                scope: [
                    "user:email"
                ]
            })(req, res)
        } catch (error) {
        }
    }

    static async CallbackGithub(req: Request, res: Response, next: NextFunction) {
        try {
            let { id, _json } = req.user as any;
            let [chekUser] = await client.users.findMany({ where: { user_patfrom_id: Number(id) } })
            if (chekUser) {
                let access_token = sign({ id: chekUser.id, })
                let refresh_token = sign({ id: chekUser.id })
                res.send({
                    succes: true,
                    message: "Siz ro`yxatdan o`tgansiz",
                    data: {
                        access_token,
                        refresh_token,
                        expireInd: 60
                    }
                })
            } else {
                let users = await client.users.create({
                    data: {
                        user_patfrom_id: _json.id,
                        fullname: _json.name,
                        email: _json.email,
                    }
                })
                let { id } = req.user as any
                let access_token = sign({ id: users.id })
                let refresh_token = sign({ id: users.id })
                res.send({
                    succes: true,
                    message: users,
                    daata: {
                        access_token,
                        refresh_token,
                        expireInd: 60
                    }
                })
            }
        } catch (error: any) {
            res.status(error.status || 400).send({
                succes: false,
                message: error.message
            })
        }
    }

    static async getAllUser(req: Request, res: Response, next: NextFunction) {
        try {
            let users = await client.users.findMany({include: { basket: { select: { books: { select: { title: true, author: true, price: true } } } } }})
            res.send({
                succes: true,
                message: users
            })
        } catch (error: any) {
            res.status(error.status || 400).send({
                succes: false,
                message: error.message
            })
        }
    }

    static async getMeUser(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.user
            let [user] = await client.users.findMany({ where: { id }, include: { basket: { select: { books: { select: { title: true, author: true, price: true } } } } } })
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User not found",
                });
            }
            return res.status(200).send({
                success: true,
                data: user
            });
        } catch (error: any) {
            res.status(error.status || 400).send({
                succes: false,
                message: error.message
            })
        }
    }

    static async admin(req: Request, res: Response, next: NextFunction) {
        try {
            let { user_patfrom_id, fullname, email, isAdmin }: Omit<users, "id"> = req.body
            let admin: users = await client.users.create({
                data: {
                    user_patfrom_id: 7777,
                    fullname: "7777",
                    email: "7777",
                    isAdmin: true
                }
            })
            res.status(200).send({
                succes: true,
                message: "Create admin 👌🏻",
                data: admin
            })
        } catch (error: any) {
            res.status(error.status || 400).send({
                succes: false,
                message: error.message
            })
        }
    }

    static async tokenGenerate(req: Request, res: Response, next: NextFunction) {
        try {
            let { fullname }: Partial<users> = req.body
            let [admin]: users[] = await client.users.findMany({ where: { fullname } })
            if (admin) {
                let token = sign({ id: admin.id })
                res.status(200).send({
                    succes: true,
                    data: admin,
                    token
                })
            } else {
                res.send({
                    success: false,
                    message: "Admin not found"
                })
            }
        } catch (error: any) {
            res.status(error.status || 400).send({
                succes: false,
                message: error.message
            })
        }
    }
}