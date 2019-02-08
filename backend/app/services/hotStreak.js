import { getSubmitCounts, saveCampaign } from './campaignEvent';
import { getCampaignData } from './campaign';
import async from 'async';
import mongoose from 'mongoose';
import config from 'config';
import { updateReference, getReference } from '../../lib/firebase';

const endPoints = {
  'totalSigned' : 'recentActivities',
  'totalVisited' : 'recentVisits'
};

export const getHotstreaks = () => {
  return new Promise((resolve, reject) => {
    getCampaignData()
      .then(processFirebaseData)
      .then(getCampaignData)
      .then(setLastSignups)
      .then(resolve)
      .catch(err => {
        console.error('HOT STREAK CRON: Error while processing Firebase data')
        console.error(err)
        reject(err)
      })
  })
}

const processFirebaseData = (tokens) => new Promise((resolve, reject) => {
  const concurrency  = config.firebase.concurrencyLimit;
  async.eachLimit(tokens, concurrency, (token, done) => {
    const type = endPoints[token.customization.hotStreak.type];
    let queriedElements = getReference(`${token.token}/${type}`).orderByKey();
    queriedElements.once('value', itemSnapshot => {
      const refData = itemSnapshot.val();
      insertEvents(refData, token._id, token.userId, token.customization.showLast, token.customization.hotStreak.type).then((updates) => {
        updateReference(itemSnapshot.ref, updates);
        done();
      }).catch(err => {
        reject(err);
      });
    });
  }, (err) => err ? reject(err) : resolve())
})

const setLastSignups = (campaigns) => {
  campaigns.forEach(async(campaign) => {
    const count = await getSubmitCounts(campaign._id,campaign.customization.hotStreak);
    const endPoint = campaign.customization.hotStreak.type;
    let totalRef = getReference(`${campaign.token}/${endPoint}`);
    totalRef.once('value', () => {
      updateReference(totalRef.ref, count);
    });
  });
}

const insertEvents = (refData, campaignId, userId, showLast, hotStreaktype) => new Promise((resolve, reject) => {
  const concurrency  = config.firebase.concurrencyLimit;
  if(refData){
    const keys = Object.keys(refData);
    let count = 0;
    let updates = {}

    async.eachLimit(keys, concurrency, (key, done) => {
      const refDataVal = refData[key];
      let locationArr = (refDataVal.loc) ? refDataVal.loc.split(",") : [];
      const campaignEvent = {
        name: 'hot streaks',        
        campaignId: mongoose.Types.ObjectId(campaignId),
        userId: mongoose.Types.ObjectId(userId),
        type: hotStreaktype,
        data: {
          dataFireBaseId: key,
          city: refDataVal.city,
          country: refDataVal.country,
          formData: {
            lastName: refDataVal.lastName
          },
          ip: refDataVal.ip,
          location: {
            lat: locationArr[0] || '',
            long: locationArr[1] || '',
            mapUrl: 'map'
          }
        },
        timestamp: refDataVal.timestamp
      };
      saveCampaign(campaignEvent).then(() => {
        if(count++ < showLast){
          updates[key] = refDataVal;          
        }
        done()
      }).catch(err => {
        if(err.name =='MongoError' && err.code === 11000) {
          console.log("Duplicate Storage In DB",err)
          if(count++ < showLast){
            updates[key] = refDataVal;          
          }
          done()
        } else{
          reject(err);
        }
      }); 
    }, (err) => err ? reject(err) : resolve(updates))
  } else{
    resolve({})
  }  
}).catch(err => {
  reject(err);
})