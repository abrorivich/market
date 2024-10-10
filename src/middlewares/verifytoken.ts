import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verify } from "@utils";

const prisma = new PrismaClient();

const verifyToken = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { token } = req.headers as { token?: string };

        if (!token) {
            res.status(404).send({
                success: false,
                message: "Token is not defined"
            });
            return;
        }

        const decoded = verify(token);
        if (!decoded) {
            res.status(400).send({
                success: false,
                message: "Token is invalid"
            });
            return;
        }

        const { id } = decoded;

        try {
            const user = await prisma.users.findMany({
                where: {
                    id,
                },
            });
            if (user) {
                req.user = id; // Attach user ID to request
                return next();
            } else {
                res.status(400).send({
                    success: false,
                    message: "Token is wrong"
                });
            }
        } catch (error: any) {
            res.status(500).send({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    };
};

export { verifyToken }
