import Joi from 'joi';
import { prisma } from '../../prisma/client';

const addSchema = Joi.object({
    productId: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
});

const updateSchema = Joi.object({
    cartId: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
});

const makeOrderSchema = Joi.object({
    customerId: Joi.number().integer().min(1).optional(),
    receiverName: Joi.string().required(),
    receiverAddress: Joi.string().required(),
    receiverPhone: Joi.string().required(),
    items: Joi.array().items(Joi.object({
        id: Joi.number().integer().required(),
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
    }).unknown()).min(1)
}).unknown();

export const addValidator = async (data: any) => {
    const { value, error } = addSchema.validate(data);
    if (error) throw error

    const product = await prisma.product.findUnique({ where: { id: value.productId } });
    if (!product) throw { code: 404, message: 'Product not found!' };

    if (product.stock < value.quantity) throw { code: 409, message: 'Not enough stock!' };

    return value;
}

export const updateValidator = async (data: any) => {
    const { value, error } = updateSchema.validate(data);
    if (error) throw error

    const cart = await prisma.cart.findUnique({
        where: { id: value.cartId },
        include: { product: true }
    });

    if (!cart) throw { code: 404, message: 'Data not found!' };

    if (cart.product.stock < value.quantity) throw { code: 409, message: 'Not enough stock!' };

    return value;
}

export const makeOrderValidator = async (data: any) => {
    data.items = await prisma.cart.findMany({
        where: { userId: data.userId },
        include: { product: true }
    });
    const { error } = makeOrderSchema.validate(data);
    if (error) throw error

    for (const i of data.items) {
        if (i.product.stock < i.quantity) throw { code: 409, message: `Not enough stock for productId: ${i.product.id}` };
    }

    return data;
}
