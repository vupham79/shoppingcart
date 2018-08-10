import { Router } from 'express';
import { roleAdmin } from '../../services/role.services';
import { authJwt } from '../../services/auth.services';
import * as categoryController from './category.controllers';
const routes = new Router();

routes.get('/', categoryController.getCategoryList);
routes.get('/:id', categoryController.getCategory);
routes.post('/create', authJwt, roleAdmin, categoryController.createCategory);
routes.patch('/:id', authJwt, roleAdmin, categoryController.updateCategory);
routes.delete('/:id', authJwt, roleAdmin, categoryController.deleteCategory);

export default routes;
