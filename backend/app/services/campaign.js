import { Campaign } from '../models';

export const getCampaignData = () => Campaign.find({}).select({'token': 1, '_id': 1, 'userId': 1, 'customization.showLast': 1, 'customization.hotStreak': 1}).lean();

export const saveCampaign = (campaignEvent) => new Promise((resolve, reject) => {
  campaignEvent.save(err => {
    if(err){
      reject(err)
    } else {      
      resolve()
    }
  });
});