import { Router } from 'express';
import validate from 'express-validation';
import { authJwt } from '../../services/auth.services';
import { roleAdmin, roleUser } from '../../services/role.services'; 
import * as productController from './product.controllers';
import productValidation from './product.validations';
const routes = new Router();

routes.get('/', productController.getProductList);
routes.post('/', authJwt, roleAdmin, validate(productValidation.create), productController.createProduct);
routes.post('/:id', authJwt, roleAdmin, productController.deleteProduct);
routes.get('/:id', productController.getProduct);
routes.patch('/:id', authJwt, roleAdmin, validate(productValidation.update), productController.updateProduct);

export default routes;
