import express from 'express';
import UserController from '../controllers/userController';

const initUserRoutes = () => {
  const userRoutes = express.Router();

  userRoutes.get('/', UserController.getAllUser);
  userRoutes.post('/', UserController.createUser);
  userRoutes.delete('/:id', UserController.deleteUser);
  userRoutes.patch('/:id', UserController.updateUserById);

  return userRoutes;
};

export default initUserRoutes;
