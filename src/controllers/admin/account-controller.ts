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
        let user: any;
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

        if (v.name || v.email || v.password || v.image) {
            user = await prisma.user.update({
                where: { id },
                data: {
                    ...(v.name ? { name: v.name } : {}),
                    ...(v.email ? { email: v.email } : {}),
                    ...(v.password ? { password: v.password } : {}),
                    ...(v.image ? { image: v.image } : {}),
                }
            });
        }

        resSuccess(res, 200, 'Data updated!', user);
    } catch (error) {
        next(error)
    }
}

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const id = (req as any).user.id;

        const user = await prisma.user.delete({ where: { id } });

        (req as any).session.token = '';

        resSuccess(res, 200, 'Data deleted!', user);
    } catch (error) {
        next(error)
    }
}