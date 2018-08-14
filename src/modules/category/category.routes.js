import { Router } from 'express';
import { roleAdmin } from '../../services/role.services';
import { authJwt } from '../../services/auth.services';
import * as categoryController from './category.controllers';
const routes = new Router();

routes.get('/', categoryController.getCategoryList);
routes.post('/', authJwt, roleAdmin, categoryController.createCategory);
routes.get('/:id', categoryController.getCategory);
routes.patch('/:id', authJwt, roleAdmin, categoryController.updateCategory);
routes.delete('/:id', authJwt, roleAdmin, categoryController.deleteCategory);

export default routes;
