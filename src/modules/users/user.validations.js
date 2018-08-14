import Joi from 'joi';

export default {
    register: {
        body: {
            phone: Joi.string().trim().required(),
            password: Joi.string().required(),
            name: Joi.string().trim().min(3),
            address: Joi.string().trim().min(5),
        },
    },
    createUser: {
        body: {
            phone: Joi.string().trim().required(),
            password: Joi.string().required(),
            name: Joi.string().trim().min(3),
            address: Joi.string().trim().min(5),
            role: Joi.string().required(),
        }
    },
    login: {
        body: {
            phone: Joi.string().trim().required(),
            password: Joi.string().trim().required(),
        },
    },
    updateProfile: {
        body: {
            password: Joi.string().required(),
            name: Joi.string().min(3).required(),
            address: Joi.string().min(5),
        },
    },
    editProfile: {
        body: {
            password: Joi.string().required(),
            name: Joi.string().min(3).required(),
            address: Joi.string().min(5),
            role: Joi.string().required(),
        }
    }
};