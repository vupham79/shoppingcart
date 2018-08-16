import { Router } from 'express';
import validate from 'express-validation';
import * as userController from './user.controllers';
import { authLocal, authJwt } from '../../services/auth.services';
import { roleAdmin, roleUser } from '../../services/role.services';
import userValidation from './user.validations';
const routes = new Router();

routes.get('/', authJwt, roleAdmin, userController.getUserList);
routes.post('/', authJwt, roleAdmin, userController.createUser)
routes.post('/login', authLocal, userController.authUser);
routes.post('/register', validate(userValidation.register), userController.registerUser);
routes.get('/:id', authJwt, roleUser, userController.getUser);
routes.delete('/:id', authJwt, roleAdmin, userController.deleteUser);
routes.patch('/:id/edit', authJwt, roleAdmin, validate(userValidation.editProfile), userController.editUser);
routes.patch('/:id/update', authJwt, roleUser, validate(userValidation.updateProfile), userController.updateUser);

export default routes;