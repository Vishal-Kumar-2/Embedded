import { getEventsBefore, deleteEvents } from '../services/campaignEvent';
import { getCampaignData } from '../services/campaign';
import { insertLegacyCampaignEvents } from '../services/legacyCampaignEvent';
import config from 'config';
import async from 'async';
import _ from 'lodash';

export const removeGarbageData = () => {
  getCampaignData()
  .then(getGarbageForCampaigns)
  // .then()
  .catch((err) => {
    console.log(err,"ERROR WHILE RUNNING GARBAGE COLLECTOR");
  })
}

const getGarbageForCampaigns = (tokens) => {
  const concurrency = config.firebase.concurrencyLimit;  

  async.eachLimit(tokens, concurrency, (token, done) => {
    let options = { skip: 0, limit: 2};
    let eventsLength = 0;
    
    async.whilst(
      () => options.skip == 0 || eventsLength > 0,
      async () => {
        const campaignEvents = await getEventsBefore(token._id, token.customization.hotStreak, options);
        eventsLength = campaignEvents.length;
        if(eventsLength){
          options.skip += eventsLength;
          insertLegacyCampaignEvents(campaignEvents).then(() => {
            const eventIds = _.map(campaignEvents, '_id');
            deleteEvents(eventIds);
          })
          .catch((err) => {
            throw err;
          })
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