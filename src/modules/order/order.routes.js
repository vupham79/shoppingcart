import { Router } from 'express';
import * as OrderController from './order.controllers';

const routes = new Router();

routes.get('/', OrderController.getOrders);
routes.post('/', OrderController.createOrder);
routes.get('/:id', OrderController.getOrder);
routes.patch('/:id', OrderController.updateOrder);
routes.delete('/:id', OrderController.deleteOrder);

export default routes;