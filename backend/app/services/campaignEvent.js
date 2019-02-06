import { CampaignEvent } from '../models';

export const getSubmitCounts = (campaignId, hotStreak) => {
  let dateHoursAgo = new Date(Date.now() - hotStreak.pastHours * 60 * 60 * 1000);
  return CampaignEvent.count({ campaignId, type: hotStreak.type, timestamp: { $gt: dateHoursAgo } });
}