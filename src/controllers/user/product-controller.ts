import { RequestHandler } from "express";
import { resSuccess } from "../../utils/response-format";
import { prisma } from "../../prisma/client";
import { filterValidator } from "../../validators/product-filter-validator";

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