import { RequestHandler } from "express";
import { resError } from "../utils/response-format";

export const isUser: RequestHandler = (req, res, next) => {
    if ((req as any).user.role != 'USER') {
        resError(res, 401, 'Unauthorized, you cant access this feature!');
        return;
    }

    next();
}