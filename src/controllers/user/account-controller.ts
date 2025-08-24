import { RequestHandler } from "express";
import { resSuccess } from "../../utils/response-format";
import { updateValidator, transferPointValidator } from "../../validators/user/account-validator";
import { prisma } from "../../prisma/client";
import { globals } from "../../globals";
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';

export const get: RequestHandler = async (req, res, next) => {
    try {
        resSuccess(res, 200, 'Success receiving data!', (req as any).user)
    } catch (error) {
        next(error)
    }
}

export const update: RequestHandler = async (req, res, next) => {
    try {
        const id = (req as any).user.id;
        let v = await updateValidator({ id, ...req.body, image: req.file });

        if (v.password) v.password = await bcrypt.hash(v.password, 10);
        if (v.image) {
            const image = (await prisma.user.findUnique({ where: { id } }))?.image;

            if (image && image != 'profile-default.png') {
                const filePath = path.join(globals.FULL_UPLOAD_PATH, image);

                await fs.unlink(filePath).catch(() => { return; });
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            let user: any;
            let customer: any;

            if (v.name || v.email || v.password || v.image) {
                user = await tx.user.update({
                    where: { id },
                    data: {
                        ...(v.name ? { name: v.name } : {}),
                        ...(v.email ? { email: v.email } : {}),
                        ...(v.password ? { password: v.password } : {}),
                        ...(v.image ? { image: v.image } : {}),
                    }
                });
            }

            if (v.address || v.phone) {
                customer = await tx.customer.update({
                    where: { userId: id },
                    data: {
                        ...(v.address ? { address: v.address } : {}),
                        ...(v.address ? { phone: v.phone } : {}),
                    }
                });
            }

            return { user, customer }
        })
            .catch(() => { throw { message: 'Failed to update data!' } });

        resSuccess(res, 200, 'Data updated!', result);
    } catch (error) {
        next(error)
    }
}

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const id = (req as any).user.id;

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.delete({ where: { id }, include: { customer: true } });

            return { user }
        })
            .catch((e) => { throw { message: e } });

        (req as any).session.token = '';

        resSuccess(res, 200, 'Data deleted!', result);
    } catch (error) {
        next(error)
    }
}

export const transferPoint: RequestHandler = async (req, res, next) => {
    try {
        const senderId = (req as any).user.customer.id;
        const v = await transferPointValidator({ ...req.body, senderId });

        const result = await prisma.$transaction(async (tx) => {
            const sender = await tx.customer.update({
                where: { id: senderId },
                data: { point: { decrement: v.amount } },
            });

            const receiver = await tx.customer.update({
                where: { id: v.receiverId },
                data: { point: { increment: v.amount } },
            });

            return { pointTransfered: v.amount, sender, receiver }
        })
            .catch(() => { throw { message: 'Unable to transfer point!' } });

        resSuccess(res, 200, 'Point transfered!', result);
    } catch (error) {
        next(error)
    }
} 