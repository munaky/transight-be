import { Request, Response, NextFunction } from "express"
import { resError } from "../utils/response-format";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const message = err.message || 'Internal Server Error';
    const code = err.code || 500;

    resError(res, code, message);
}