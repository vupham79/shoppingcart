import { Router } from 'express';
import validate from 'express-validation';
import { roleAdmin } from '../../services/role.services';
import { authJwt } from '../../services/auth.services';
<<<<<<< HEAD
import validate from 'express-validation';
=======
>>>>>>> d204ec271177cc22decce24401da03ef9ac8fa54
import categoryValidation from './category.validations';
import * as categoryController from './category.controllers';
const routes = new Router();

routes.get('/', categoryController.getCategoryList);
<<<<<<< HEAD
routes.post('/', authJwt, roleAdmin, validate(categoryValidation.create), categoryController.createCategory);
routes.get('/:id', categoryController.getCategory);
routes.patch('/:id', authJwt, roleAdmin, validate(categoryValidation.update),  categoryController.updateCategory);
=======
routes.post('/', authJwt, roleAdmin, validate(categoryValidation.createCategory), categoryController.createCategory);
routes.get('/:id', categoryController.getCategory);
routes.patch('/:id', authJwt, roleAdmin, validate(categoryValidation.updateCategory), categoryController.updateCategory);
>>>>>>> d204ec271177cc22decce24401da03ef9ac8fa54
routes.delete('/:id', authJwt, roleAdmin, categoryController.deleteCategory);

export default routes;
