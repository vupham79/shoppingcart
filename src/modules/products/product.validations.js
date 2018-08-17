import Joi from 'joi';

export default {
    createProduct: {
        body: {
            id: Joi.string().trim().required(),
            name: Joi.string().min(3).required(),
            category: Joi.string().required(),
            image: Joi.string().required(),
            status: Joi.string(),
            price: Joi.string(),
            quantity: Joi.number().min(0),
        }
    },
    updateProduct: {
        body: {
            name: Joi.string().min(3).trim().required(),
            category: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.string().required(),
            quantity: Joi.number().min(0),
        }
    }
}