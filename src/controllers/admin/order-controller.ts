import { RequestHandler } from "express";
import { resSuccess } from "../../utils/response-format";
import { prisma } from "../../prisma/client";
import { filterValidator } from "../../validators/order-filter-validator";

export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const filters = filterValidator(req.query);
        const orderByFilter: any = {};
        orderByFilter[filters.orderBy] = filters.order;

        const orders = await prisma.orderItem.groupBy({
            by: 'orderId',
            _sum: { total: true },
            _count: { quantity: true },
            having: {
                total: {
                    _sum: {
                        gte: filters.minTotalPrice,
                        ...(filters.maxTotalPrice ? { lte: filters.maxTotalPrice } : {}),
                    },
                },
                quantity: {
                    _sum: {
                        gte: filters.minTotalQuantity,
                        ...(filters.maxTotalQuantity ? { lte: filters.maxTotalQuantity } : {}),
                    }
                }
            },
            orderBy: { orderId: 'asc' },
            skip: (filters.page - 1) * filters.limit,
            take: filters.limit,
        });

        resSuccess(res, 200, 'Data retrieved!', orders)
    } catch (error) {
        next(error)
    }
}

export const get: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const order = await prisma.order.findUnique({
            where: { id },
            include: { orderItems: true },
        });
        if (!order) throw { code: 404, message: 'Data not found!' }

        resSuccess(res, 200, 'Data retrieved!', order)
    } catch (error) {
        next(error)
    }
}