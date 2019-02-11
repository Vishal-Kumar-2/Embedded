import { CampaignEvent } from '../models';

export const getSubmitCounts = (campaignId, hotStreak) => {
  let dateHoursAgo = new Date(Date.now() - hotStreak.pastHours * 60 * 60 * 1000);
  return CampaignEvent.count({ campaignId, type: hotStreak.type, timestamp: { $gt: dateHoursAgo } });
}

export const saveCampaign = (campaignEventData) => new Promise((resolve, reject) => {
  const campaignEvent = new CampaignEvent(campaignEventData);
  campaignEvent.save(err => {
    if(err){
      reject(err)
    } else {      
      resolve()
    }
  });
});

export const getEventsBefore = (campaignId, hotStreak, options) => {
  let timeAgo = new Date(Date.now() - hotStreak.pastHours * 60 * 60 * 1000);
  return CampaignEvent.find({ campaignId, type: hotStreak.type, timestamp: { $lt: timeAgo } }).skip(options.skip).limit(options.limit).lean();
}

export const deleteEvents = (eventIds) => CampaignEvent.deleteMany({ _id: { $in: eventIds }});