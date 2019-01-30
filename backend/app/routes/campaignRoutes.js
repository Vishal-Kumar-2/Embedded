import express from 'express';
import verifyToken from '../../lib/jwt';
import CampaignController from '../controllers/campaignController';

const initCampaignRoutes = () => {
  const campaignRoutes = express.Router();

  campaignRoutes.get('/', verifyToken, CampaignController.getCampaignByToken);
  campaignRoutes.get('/all', CampaignController.getAllCampaign);
  campaignRoutes.post('/', CampaignController.createCampaign);
  campaignRoutes.delete('/', CampaignController.deleteCampaignByToken);
  campaignRoutes.patch('/', CampaignController.updateCampaignByToken);

  return campaignRoutes;
};

export default initCampaignRoutes;
