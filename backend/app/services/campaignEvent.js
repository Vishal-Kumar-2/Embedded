import { CampaignEvent } from '../models';

export const getSubmitCounts = (campaignId, hotStreak) => {
  let dateHoursAgo = new Date(Date.now() - hotStreak.pastHours * 60 * 60 * 1000);
  return CampaignEvent.count({ campaignId, type: hotStreak.type, timestamp: { $gt: dateHoursAgo } });
}

export const saveCampaign = (campaignEvent) => new Promise((resolve, reject) => {
  campaignEvent.save(err => {
    if(err){
      reject(err)
    } else {      
      resolve()
    }
  });
});