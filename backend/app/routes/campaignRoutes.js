import express from 'express';
import { isAuthTokenValid, isBusinessPlanActive, verifyToken } from '../middlewares';
import CampaignController from '../controllers/campaignController';

const initCampaignRoutes = () => {
  const campaignRoutes = express.Router();

  campaignRoutes.get('/:token', verifyToken, CampaignController.getCampaignByToken);
  campaignRoutes.get('/:token/hotstreak', verifyToken, CampaignController.getHotStreak);
  campaignRoutes.get('/all', CampaignController.getAllCampaign);

  // protected routes
  campaignRoutes.post('/', isAuthTokenValid, CampaignController.createCampaign);
  campaignRoutes.delete('/', isAuthTokenValid, CampaignController.deleteCampaignByToken);
  campaignRoutes.patch('/', isAuthTokenValid, CampaignController.updateCampaignByToken);
  
  // business plan routes
  campaignRoutes.get(':token/conversions', verifyToken, isBusinessPlanActive,
    CampaignController.getConversions);

  return campaignRoutes;
};

export default initCampaignRoutes;
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.e3UwvG12weaHaVWZ2u-vuH1SkOb6Ee0NFMVJGtTgwio
