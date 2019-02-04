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
