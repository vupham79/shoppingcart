import Joi from 'joi';

export default {
    createBlog: {
        body: {
            title: Joi.string().trim().required(),
            owner: Joi.string().required(),
            content: Joi.string(),
        }
    },
    updateBlog: {
        body: {
            title: Joi.string().trim().required(),
            owner: Joi.string().required(),
            content: Joi.string().not().empty(),
        }
    }
}