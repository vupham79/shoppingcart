import Joi from 'joi';

export default {
    createOrder: {
        body: {
            id: Joi.string().required(),
            address: Joi.string().required(),
        }
    },
    updateOrder: {
        body: {
            products: Joi.required(),
            address: Joi.string().required(),
        }
    }
}