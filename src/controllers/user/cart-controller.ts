import { RequestHandler } from "express";
import { resSuccess } from "../../utils/response-format";
import { prisma } from "../../prisma/client";
import { addValidator, updateValidator, checkoutValidator } from "../../validators/user/cart-validator";
import { globals } from "../../globals";

export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const products = await prisma.cart.findMany({
            where: { userId },
            include: { product: true },
        });

        resSuccess(res, 200, 'Data retrieved!', products);
    } catch (error) {
        next(error);
    }
}

export const add: RequestHandler = async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const v = await addValidator(req.body);

        let cart = await prisma.cart.findFirst({
            where: { userId, productId: v.productId }
        });

        if (cart) {
            cart = await prisma.cart.update({
                where: { id: cart.id },
                data: { quantity: { increment: v.quantity } }
            });
            resSuccess(res, 200, 'Data exist, quantity increased!', cart);
            return;
        }
        else {
            cart = await prisma.cart.create({
                data: {
                    userId,
                    productId: v.productId,
                    quantity: v.quantity
                }
            })
        }

        resSuccess(res, 200, 'Data added!', cart);
    } catch (error) {
        next(error);
    }
}

export const update: RequestHandler = async (req, res, next) => {
    try {
        const cartId = Number(req.params.id);
        const v = await updateValidator({ ...req.body, cartId });

        const cart = await prisma.cart.update({
            where: { id: v.cartId },
            data: { quantity: v.quantity },
        })

        resSuccess(res, 200, 'Data updated!', cart);
    } catch (error) {
        next(error);
    }
}

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = (req as any).user.id;
        const cart = await prisma.cart.delete({ where: { id, userId } })
            .catch(() => { throw { message: 'Failed to delete data!' } });

        resSuccess(res, 200, 'Data deleted!', cart);
    } catch (error) {
        next(error);
    }
}

export const clear: RequestHandler = async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const carts = await prisma.cart.deleteMany({ where: { userId } })
            .catch(() => { throw { message: 'Failed to delete data!' } });

        resSuccess(res, 200, 'Data cleared!', carts);
    } catch (error) {
        next(error);
    }
}

export const checkout: RequestHandler = async (req, res, next) => {
    try {
        const user = (req as any).user;
        const items = await checkoutValidator(user.id);

        const result = await prisma.$transaction(async (tx) => {
            const order = await prisma.order.create({
                data: {
                    customerId: user.customer.id,
                    receiverName: user.name,
                    receiverAddress: user.customer.address,
                    receiverPhone: user.customer.phone,
                    orderItems: {
                        createMany: {
                            data: items.map((v) => {
                                return {
                                    productId: v.product.id,
                                    productName: v.product.name,
                                    productPrice: v.product.price,
                                    quantity: v.quantity,
                                    total: v.quantity * v.product.price,
                                }
                            })
                        }
                    }
                }
            });

            const totalPrice = await prisma.orderItem.aggregate({
                where: { orderId: order.id },
                _sum: {
                    total: true,
                }
            });
            const bonusPoint = Math.floor(Number(totalPrice._sum.total) * (Number(globals.POINT_GAIN_MULTIPLIER) || 0.001));
            if (bonusPoint == 0) return order

            const customer = await prisma.customer.update({
                where: { userId: user.id },
                data: { point: { increment: bonusPoint } }
            });

            /* Delete cart items */
            await prisma.cart.deleteMany({ where: { userId: user.id } });

            return { bonusPoint, customer, order };
        });

        if ((result as any).customer) {
            resSuccess(res, 200, 'Order created, points increased!', result);
        } else {
            resSuccess(res, 200, 'Order created!', result);
        }
    } catch (error) {
        next(error);
    }
}