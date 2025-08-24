import { RequestHandler } from "express";
import bcrypt from 'bcrypt';
import { prisma } from "../prisma/client";
import { verifyToken, signToken } from "../utils/jwt";
import { registerValidator, loginValidator } from "../validators/auth-validator";
import { resSuccess } from "../utils/response-format";

export const register: RequestHandler = async (req, res, next) => {
    try {
        const v = await registerValidator({ ...req.body, image: req.file });

        const hashed = await bcrypt.hash(v.password, 10);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: v.name,
                    email: v.email,
                    password: hashed,
                    role: v.role,
                    ...(v.image ? { image: v.image } : {}),
                }
            });

            if (user.role != 'USER') return user

            const customer = await tx.customer.create({
                data: {
                    userId: user.id,
                    address: v.address,
                    phone: v.phone,
                }
            });

            return { user, customer }
        })
            .catch(() => { throw { message: 'Failed to create data!' } });

        resSuccess(res, 201, 'Data created!', result);
    } catch (error) {
        next(error);
    }
}

export const login: RequestHandler = async (req, res, next) => {
    try {
        const v = await loginValidator(req.body);

        const user = await prisma.user.findUnique({
            where: { email: v.email },
            include: { customer: true }
        });

        const isMatch = await bcrypt.compare(v.password, (user as any).password);
        if (!isMatch) throw { code: 400, message: 'Invalid password!' }

        const token = signToken(user as any);

        (req as any).session.token = token;

        resSuccess(res, 200, 'Login Success', { token, user });
    } catch (error) {
        next(error)
    }
}
