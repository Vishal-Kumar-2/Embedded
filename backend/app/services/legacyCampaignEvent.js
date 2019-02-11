import { LegacyCampaignEvent } from '../models';

export const insertLegacyCampaignEvents = (campaignEventData) => new Promise((resolve, reject) => {
  LegacyCampaignEvent.insertMany(campaignEventData)
  .then(resolve())
  .catch((err) => {
    reject(err);
  });
});