import initUserRoutes from './userRoutes';
import initCampaignRoutes from './campaignRoutes';

const initRoutes = (app) => {

  app.use(`/user`, initUserRoutes());
  app.use(`/campaign`, initCampaignRoutes());
};

export default initRoutes;
