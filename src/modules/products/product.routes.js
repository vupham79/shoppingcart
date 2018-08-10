import { Router } from 'express';
import * as productController from './product.controllers';
const routes = new Router();

routes.get('/', productController.getProductList);
routes.get('/:id', productController.getProduct);
routes.patch('/:id', productController.updateProduct);
routes.post('/', productController.createProduct);
routes.post('/:id', productController.deleteProduct);

export default routes;
