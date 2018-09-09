import { Router } from 'express';
import * as OrderController from './order.controllers';
import { roleUser, roleAdmin } from '../../services/role.services';
import { authJwt } from '../../services/auth.services';
const routes = new Router();

routes.get('/', authJwt, roleAdmin, OrderController.getOrders);
routes.post('/', authJwt, roleUser, OrderController.createOrder);
routes.get('/:id/', authJwt, roleUser, OrderController.getOrder);
routes.patch('/:id', authJwt, roleUser, OrderController.updateOrder);
routes.delete('/:id', authJwt, roleUser, OrderController.deleteOrder);

export default routes;