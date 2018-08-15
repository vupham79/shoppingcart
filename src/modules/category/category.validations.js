import Joi from 'joi';

export default {
    create: {
        body: {
            name: Joi.string().required(),
            image: Joi.string(),
        }
    },
    update: {
        body: {
            name: Joi.string().required(),
            image: Joi.string(),
        }
    }
}