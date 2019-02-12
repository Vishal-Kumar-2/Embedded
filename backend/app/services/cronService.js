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
    console.log(err,"ERROR WHILE RUNNING GARBAGE COLLECTOR");
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
        const campaignEvents = await getEventsBefore(token._id, token.customization.hotStreak, options);
        eventsLength = campaignEvents.length;
        if(eventsLength){
          options.skip += eventsLength;
          await insertLegacyCampaignEvents(campaignEvents)
          const eventIds = _.map(campaignEvents, '_id');
          await deleteEvents(eventIds);
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
      throw 'Error While Fetching Campaign Events';
    }
  })
}