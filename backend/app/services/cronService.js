import { getEventsBefore, deleteEvents } from '../services/campaignEvent';
import { getCampaignData } from '../services/campaign';
import { insertLegacyCampaignEvents } from '../services/legacyCampaignEvent';
import config from 'config';
import async from 'async';
import _ from 'lodash';

export const removeGarbageData = () => {
  getCampaignData()
  .then(setLegacyCampaignEvent)
  .catch((err) => {
    throw err;
  })
}

const setLegacyCampaignEvent = (tokens) => {
  const concurrency = config.firebase.concurrencyLimit;  
  async.eachLimit(tokens, concurrency, (token, done) => {
    let options = { skip: 0, limit: 100};
    let eventsLength = 0;
    
    async.whilst(
      () => options.skip == 0 || eventsLength > 0,
      async () => {

        // Get All CampaignEvents Before Campaign HotStreak Past Hours
        const campaignEvents = await getEventsBefore(token._id, token.customization.hotStreak, options);

        eventsLength = campaignEvents.length;
        if(eventsLength){
          options.skip += eventsLength;

          // Insert In Legacy Campaign Event Collection Before Deleting
          await insertLegacyCampaignEvents(campaignEvents);
          logger.info('Inserted CampaignEvents In Legacy Collection For Campaign : ' + token._id);

          const eventIds = _.map(campaignEvents, '_id');

          // Delete From Campaign Event Collection
          await deleteEvents(eventIds);
          logger.info('Removed Garbage From CampaignEvents Collection: ' + token._id);
        }
      },
      (error) => {
        if(error){
          throw error;
        }
        else {
          done();
        }         
      }
    );
    
  }, (err) => {
    if(err){
      throw err;
    }
  })
}