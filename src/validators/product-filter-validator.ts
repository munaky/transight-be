import Joi from 'joi';

const filterSchema = Joi.object({
    search: Joi.string().default('').optional(),
    orderBy: Joi.string().default('id').optional(),
    order: Joi.string().valid('asc', 'desc').default('asc').optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
    limit: Joi.number().integer().min(1).default(10).optional(),
    minPrice: Joi.number().integer().min(1).default(1).optional(),
    maxPrice: Joi.number().integer().min(1).optional(),
});

export const filterValidator = (data: any) => {
    const {value, error} = filterSchema.validate(data);
    if(error) throw error;

    return value
}