import express from 'express';
import AuthController from '../controllers/authController';

const initauthRoutes = () => {
  const authRoutes = express.Router();

  authRoutes.patch('/login', AuthController.updateLoginToken);
  authRoutes.patch('/logout', AuthController.updateLogoutToken);

  return authRoutes;
};

export default initauthRoutes;
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.e3UwvG12weaHaVWZ2u-vuH1SkOb6Ee0NFMVJGtTgwio
