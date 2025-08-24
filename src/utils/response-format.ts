import { Response } from "express"

export const resJson = (res: Response,code: number|string, status: string, message: string = '', data: any = null): void => {
    res.status(Number(code) || 500).json({
        code,
        status,
        message,
        data
    });
}

export const resSuccess = (res: Response,code: number|string, message: string = '', data: any = null): void => {
    res.status(Number(code) || 500).json({
        code,
        status: 'success',
        message,
        data
    });
}

export const resError = (res: Response,code: number|string, message: string = '', data: any = null): void => {
    res.status(Number(code) || 500).json({
        code,
        status: 'error',
        message,
        data
    });
}