import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface Payload {
    [key: string]: any; // Define the shape of the payload as needed
}

const sign = (payload: Payload): string => {
    return jwt.sign(payload, "abroriv1ch" as jwt.Secret);
}

const verify = (token: string): Payload | null => {
    try {
        return jwt.verify(token, "abroriv1ch" as jwt.Secret) as Payload;
    } catch (error) {
        return null;
    }
}

export {
    sign,
    verify
};
