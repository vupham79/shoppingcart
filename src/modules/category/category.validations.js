import Joi from 'joi';

export default {
<<<<<<< HEAD
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
=======
    createCategory: {
        body: {
            name: Joi.string().min(3).required(),
            image: Joi.string()
        }
    },
    updateCategory: {
        body: {
            name: Joi.string().min(3).required(),
            image: Joi.string()
        }
    }
};
>>>>>>> d204ec271177cc22decce24401da03ef9ac8fa54
