import initUserRoutes from './userRoutes';
import initCampaignRoutes from './campaignRoutes';
import initAuthRoutes from './authRoutes';

const initRoutes = (app) => {

  app.use(`/user`, initUserRoutes());
  app.use(`/campaign`, initCampaignRoutes());
  app.use(`/`, initAuthRoutes());
};

export default initRoutes;
