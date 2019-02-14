import express from 'express';
import AuthController from '../controllers/authController';

const initauthRoutes = () => {
  const authRoutes = express.Router();

  authRoutes.post('/login', AuthController.loginUser);
  authRoutes.post('/logout', AuthController.logoutUser);

  return authRoutes;
};

export default initauthRoutes;
