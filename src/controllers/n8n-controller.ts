import { RequestHandler } from "express";
import { prisma } from "../prisma/client";
import { resSuccess } from "../utils/response-format";
import nodemailer from 'nodemailer';
import { globals } from "../globals";

export const get: RequestHandler = async (req, res, next) => {
    try {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const users = await prisma.user.findMany({
            where: {
                role: 'USER',
                createAt: {
                    gte: oneWeekAgo,
                },
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        orders: {
                            include: {
                                orderItems: true,
                            },
                        },
                    },
                },
            },
        })

        resSuccess(res, 200, 'Success get data!', users);
    } catch (error) {
        next(error);
    }
}

export const sendEmail: RequestHandler = async (req, res, next) => {
    try {
        const { html } = req.body;

        const transporter = nodemailer.createTransport({
            service: globals.NODEMAILER_SERVICE,
            auth: {
                user: globals.NODEMAILER_USER,
                pass: globals.NODEMAILER_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: globals.NODEMAILER_FROM,
            to: '010905mn@gmail.com',
            subject: globals.NODEMAILER_SUBJECT,
            html
        }); 
        
        resSuccess(res, 200, 'Email sent successfully!', info);
    } catch (error) {
        next(error);
    }
}