import { Router } from 'express';
import * as blogController from './blog.controllers';
import validate from 'express-validation';
import { authJwt } from '../../services/auth.services';
import { roleAdmin } from '../../services/role.services';
import blogValidation from './blog.validations';
const routes = new Router();

routes.get('/', blogController.getBlogs);
routes.post('/', authJwt, roleAdmin, validate(blogValidation.createBlog), blogController.createBlog);
routes.get('/:id', blogController.getBlog);
routes.delete('/:id', authJwt, roleAdmin, blogController.deleteBlog);
routes.patch('/:id', authJwt, roleAdmin, validate(blogValidation.updateBlog), blogController.updateBlog);

export default routes;