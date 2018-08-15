import Joi from 'joi';

export default {
    createProduct: {
        body: {
            id: Joi.string().trim().required(),
            name: Joi.string().min(3).required(),
            category: Joi.string().required(),
            image: Joi.string(),
            status: Joi.string(),
            price: Joi.string(),
            quantity: Joi.number().min(0),
        }
    },
    updateProduct: {
        body: {
            name: Joi.string().min(3).trim(),
            category: Joi.string(),
            image: Joi.string(),
            price: Joi.string().min(0),
            quantity: Joi.number().min(0),
        }
    }
}