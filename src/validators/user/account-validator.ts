import Joi from 'joi';
import { prisma } from '../../prisma/client';

const updateSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    image: Joi.any().optional().custom((value, helpers) => {
        return value.filename;
    }),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
});

const transferPointSchema = Joi.object({
    senderId: Joi.number().integer().required(),
    receiverId: Joi.number().integer().required(),
    amount: Joi.number().integer().min(1),
});

export const updateValidator = async (data: any) => {
    const { value, error } = updateSchema.validate(data);
    if (error) throw error;

    if (value.email) {
        const emailExist = await prisma.user.findUnique({
            where: {
                NOT: { id: value.id },
                email: value.email
            }
        });
        if (emailExist) throw { code: 409, message: 'Email already used!' };
    }

    return value;
}

export const transferPointValidator = async (data: any) => {
    const { value, error } = transferPointSchema.validate(data);
    if (error) throw error;

    const sender = await prisma.customer.findUnique({ where: { userId: value.senderId } });
    if(!sender) throw {code: 404, message: 'Sender not found!'};
    const receiver = await prisma.customer.findUnique({ where: { userId: value.receiverId } });
    if(!receiver) throw {code: 404, message: 'Receiver not found!'};

    if(sender.point < value.amount) throw {code: 409, message: 'Sender point is not enough!'};

    return value;
}