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