import Joi from 'joi';

export default {
    createCategory: {
        body: {
            name: Joi.string().min(3).required(),
            image: Joi.string()
        }
    },
    updateCategory: {
        body: {
            name: Joi.string().min(3).required(),
            image: Joi.string().required()
        }
    }
};
