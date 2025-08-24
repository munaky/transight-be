import { RequestHandler } from "express";
import { filterValidator } from "../../validators/product-filter-validator";
import { prisma } from '../../prisma/client';
import { resSuccess } from "../../utils/response-format";
import { createValidator, updateValidator } from "../../validators/admin/product-validator";
import path from 'path';
import { globals } from "../../globals";
import fs from 'fs/promises';

export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const filters = filterValidator(req.query);
        const orderByFilter: any = {}
        orderByFilter[filters.orderBy] = filters.order

        const products = await prisma.product.findMany({
            where: {
                name: { contains: filters.search, mode: 'insensitive' },
                price: {
                    gte: filters.minPrice,
                    ...(filters.maxPrice ? { lte: filters.maxPrice } : {})
                }
            },
            orderBy: orderByFilter,
            skip: (filters.page - 1) * filters.limit,
            take: filters.page * filters.limit,
        });

        resSuccess(res, 200, 'Data Retrieved!', products);
    } catch (error) {
        next(error);
    }
}

export const get: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const products = await prisma.product.findUnique({ where: { id } });
        if (!products) throw { code: 404, message: 'Data not found!' }

        resSuccess(res, 200, 'Data Retrieved!', products);
    } catch (error) {
        next(error);
    }
}

export const create: RequestHandler = async (req, res, next) => {
    try {
        const v = createValidator({ ...req.body, image: req.file });

        const product = await prisma.product.create({
            data: {
                name: v.name,
                price: v.price,
                stock: v.stock,
                ...(v.image ? { image: v.image } : {})
            }
        });

        resSuccess(res, 201, 'Data created!', product);
    } catch (error) {
        next(error);
    }
}

export const update: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const v = await updateValidator({ ...req.body, image: req.file, id });

        if (v.image) {
            const image = (await prisma.user.findUnique({ where: { id } }))?.image;

            if (image && image != 'profile-default.png') {
                const filePath = path.join(globals.FULL_UPLOAD_PATH, image);

                await fs.unlink(filePath).catch(() => { return; });
            }
        }

        if (!v.name && !v.price && !v.stock && !v.image) throw { code: 200, message: 'Nothing changed!' }
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(v.name ? { name: v.name } : {}),
                ...(v.price ? { price: v.price } : {}),
                ...(v.stock ? { stock: v.stock } : {}),
                ...(v.image ? { image: v.image } : {}),
            }
        })

        resSuccess(res, 200, 'Data updated!', product);
    } catch (error) {
        next(error);
    }
}

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma.product.update({
            where: { id },
            data: {deleteAt: new Date()}
        }).catch(() => {throw {message: 'Failed to delete data!'}});

        resSuccess(res, 200, 'Data deleted!', product);
    } catch (error) {
        next(error);
    }
}

export const restore: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const products = await prisma.product.update({
             where: { id }, 
            data: {deleteAt: null}
            }).catch(() => {throw {message: 'Failed to restore data!'}});;

        resSuccess(res, 200, 'Data restored!', products);
    } catch (error) {
        next(error);
    }
}

