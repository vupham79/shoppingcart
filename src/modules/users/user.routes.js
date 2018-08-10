import { Router } from 'express';
import validate from 'express-validation';
import * as userController from './user.controllers';
import { authLocal, authJwt } from '../../services/auth.services';
import { roleAdmin, roleUser } from '../../services/role.services';
import userValidation from './user.validations';
const routes = new Router();

routes.get('/', userController.getUserList);
routes.post('/', authJwt, roleAdmin, userController.createUser)
routes.get('/:id', authJwt, roleUser, userController.getUser);
routes.post('/:id', authJwt, roleAdmin, userController.deleteUser);
routes.patch('/:id', authJwt, validate(userValidation.editProfile), userController.updateUser);
routes.post('/register', validate(userValidation.register), userController.registerUser);
routes.post('/login', authLocal, validate(userValidation.login), userController.authUser);

export default routes;