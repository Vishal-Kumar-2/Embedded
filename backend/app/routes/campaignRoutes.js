import express from 'express';
import verifyToken from '../../lib/jwt';
import { isAuthTokenValid } from '../utils/validate';
import CampaignController from '../controllers/campaignController';

const initCampaignRoutes = () => {
  const campaignRoutes = express.Router();

  campaignRoutes.get('/', verifyToken, CampaignController.getCampaignByToken);
  campaignRoutes.get('/all', CampaignController.getAllCampaign);
  campaignRoutes.post('/', isAuthTokenValid, CampaignController.createCampaign);
  campaignRoutes.delete('/', isAuthTokenValid, CampaignController.deleteCampaignByToken);
  campaignRoutes.patch('/', isAuthTokenValid, CampaignController.updateCampaignByToken);

  return campaignRoutes;
};

export default initCampaignRoutes;
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.e3UwvG12weaHaVWZ2u-vuH1SkOb6Ee0NFMVJGtTgwio
