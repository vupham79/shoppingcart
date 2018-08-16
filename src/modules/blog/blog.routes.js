import { Router } from 'express';
import * as blogController from './blog.controllers';
import validate from 'express-validation';
import blogValidation from './blog.validations';
const routes = new Router();

routes.get('/', blogController.getBlogs);
routes.post('/', validate(blogValidation.createBlog), blogController.createBlog);
routes.get('/:id', blogController.getBlog);
routes.delete('/:id', blogController.deleteBlog);
routes.patch('/:id', validate(blogValidation.updateBlog), blogController.updateBlog);

export default routes;