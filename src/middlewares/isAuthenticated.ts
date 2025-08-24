import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";
import { resError } from "../utils/response-format";

export const isAuthenticated: RequestHandler = (req, res, next) => {
    try {
        const token = (req as any).session.token;

        if (!token) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }

        const decoded = verifyToken(token);

        (req as any).user = decoded;

        next();
    } catch(error) {
        resError(res, 401, 'No session found!')
    }
}
