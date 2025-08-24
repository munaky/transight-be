import Joi from 'joi';
import { prisma } from '../../prisma/client';

export const createSchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().integer().min(1).required(),
    stock: Joi.number().integer().min(0).required(),
    image: Joi.any().optional().custom((value, helpers) => value.filename),
});

export const updateSchema = createSchema.keys({
    id: Joi.number().required(),
    name: Joi.string().min(3).optional(),
    price: Joi.number().integer().min(1).optional(),
    stock: Joi.number().integer().min(0).optional(),
    image: Joi.any().optional().custom((value, helpers) => value.filename),
});


export const createValidator = (data: any) => {
    const { value, error } = createSchema.validate(data);
    if (error) throw error;

    return value;
}

export const updateValidator = async (data: any) => {
    const { value, error } = updateSchema.validate(data);
    if (error) throw error;

    const product = await prisma.product.findUnique({ where: { id: value.id } });
    if (!product) throw { code: 404, message: 'Data not found or already disabled!' };

    return value;
}