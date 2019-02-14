import express from 'express';
import UserController from '../controllers/userController';

const initUserRoutes = () => {
  const userRoutes = express.Router();

  userRoutes.get('/', UserController.getAllUser);
  userRoutes.get('/:id', UserController.getUserById);
  userRoutes.post('/', UserController.signUp);
  userRoutes.delete('/:id', UserController.deleteUser);
  userRoutes.put('/:id', UserController.updateUserById);

  return userRoutes;
};

export default initUserRoutes;
