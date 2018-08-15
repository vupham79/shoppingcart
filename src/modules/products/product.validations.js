import Joi from 'joi';

export default {
    create: {
        body: {
            name: Joi.string().required(),
            category: Joi.string().required(),
            status: Joi.string(),
            image: Joi.string(),
            price: Joi.number().min(0),
            quantity: Joi.number().min(0),
        }
    },
    update: {
        body: {
            category: Joi.string().required(),
            status: Joi.string(),
            image: Joi.string(),
            price: Joi.number().min(0),
            quantity: Joi.number().min(0),
        }
    }
}