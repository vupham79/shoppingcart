import { Router } from 'express';
import validate from 'express-validation';
import * as userController from './user.controllers';
import { authLocal, authJwt } from '../../services/auth.services';
import { roleAdmin } from '../../services/role.services';
import userValidation from './user.validations';
const routes = new Router();

routes.get('/', authJwt, roleAdmin, userController.getUserList);
routes.get('/:id', authJwt, userController.getUser);
routes.post('/:id', authJwt, userController.deleteUser);
routes.patch('/:id', authJwt, validate(userValidation.editProfile), userController.updateUser);
routes.post('/register', validate(userValidation.register), userController.createUser);
routes.post('/login', authLocal, validate(userValidation.login), userController.authUser);

export default routes;