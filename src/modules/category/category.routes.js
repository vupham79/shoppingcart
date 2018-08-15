import { Router } from 'express';
import validate from 'express-validation';
import { roleAdmin } from '../../services/role.services';
import { authJwt } from '../../services/auth.services';
import categoryValidation from './category.validations';
import * as categoryController from './category.controllers';
const routes = new Router();

routes.get('/', categoryController.getCategoryList);
routes.post('/', authJwt, roleAdmin, validate(categoryValidation.createCategory), categoryController.createCategory);
routes.get('/:id', categoryController.getCategory);
routes.patch('/:id', authJwt, roleAdmin, validate(categoryValidation.updateCategory), categoryController.updateCategory);
routes.delete('/:id', authJwt, roleAdmin, categoryController.deleteCategory);

export default routes;
