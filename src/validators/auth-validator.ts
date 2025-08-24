import Joi from 'joi';
import { prisma } from '../prisma/client';

export const registerAdminSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('USER', 'ADMIN').required(),
    image: Joi.any().optional().custom((value, helpers) => {
        return value.filename;
    }),
});

export const registerUserSchema = registerAdminSchema.keys({
    address: Joi.string().required(),
    phone: Joi.string().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

/* Validator when register USER and ADMIN */
export const registerValidator = async (data: any) => {
    let result: any;

    if(data.role == 'USER'){
        result = registerUserSchema.validate(data);
    }else{
        result = registerAdminSchema.validate(data);
    }

    if (result.error) throw result.error
    if (await prisma.user.findUnique({ where: { email: result.value.email } })) throw { code: 409, message: 'Email already used!' }

    return result.value;
}

export const loginValidator = async (data: any) => {
    const result = loginSchema.validate(data)

    if (result.error) throw result.error
    if (!await prisma.user.findUnique({ where: { email: result.value.email } })) throw { code: 401, message: 'Email not registered!' }

    return result.value
}