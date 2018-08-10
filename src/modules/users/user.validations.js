import Joi from 'joi';

export default {
    register: {
        body: {
            phone: Joi.string().required(),
            password: Joi.string().required(),
            name: Joi.string().min(3).required(),
            role: Joi.number(),
            address: Joi.string().min(5),
        },
    },
    login: {
        body: {
            phone: Joi.string().required(),
            password: Joi.string().required(),
        },
    },
    editProfile: {
        body: {
            password: Joi.string(),
            name: Joi.string().min(3),
            role: Joi.number(),
            address: Joi.string().min(5),
        },
    },
};