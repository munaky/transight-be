import Joi from 'joi';

const filterSchema = Joi.object({
    search: Joi.string().default('').optional(),
    order: Joi.string().valid('asc', 'desc').default('asc').optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
    limit: Joi.number().integer().min(1).default(10).optional(),
    minTotalPrice: Joi.number().integer().min(1).default(1).optional(),
    maxTotalPrice: Joi.number().integer().min(1).optional(),
    minTotalQuantity: Joi.number().integer().min(1).default(1).optional(),
    maxTotalQuantity: Joi.number().integer().min(1).optional(),
});

export const filterValidator = (data: any) => {
    const {value, error} = filterSchema.validate(data);
    if(error) throw error;

    return value
}