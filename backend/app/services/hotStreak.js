import { Campaign, CampaignEvent } from '../models';
import { getSubmitCounts } from './campaignEvent';
import async from 'async';
import mongoose from 'mongoose';
import config from 'config';
import firebase from '../../lib/firebase';

export function hotStreakService() {
  return new Promise((resolve, reject) => {
    getCampaignTokens()
      .then(processFirebaseData)
      .then(getCampaignHotStreak)
      .then(setLastSignups)
      .then(resolve)
      .catch(err => {
        console.error('HOT STREAK CRON: Error while processing Firebase data')
        console.error(err)
      })
  })
}

const getCampaignTokens = () => Campaign.find({}).select({'token': 1, '_id': 1, 'userId': 1}).lean();
const getCampaignHotStreak = () => Campaign.find({}).select({'token': 1, '_id': 1, 'customization.hotStreak': 1}).lean();

const processFirebaseData = (tokens) => new Promise((resolve, reject) => {
  const concurrency  = config.firebase.concurrencyLimit;
  async.eachLimit(tokens, concurrency, (token, done) => {
    let queriedElements = firebase.database().ref(`${token.token}/recentActivities`).orderByKey();
    queriedElements.once('value', itemSnapshot => {
      const signUps = itemSnapshot.val()
      insertEvents(signUps, token._id, token.userId).then((updates) => {
        itemSnapshot.ref.set(updates);
        done();
      });
    })
  }, (err) => err ? reject(err) : resolve())
})

const setLastSignups = (campaigns) => {
  console.log(campaigns,"ddshghjghg")
  campaigns.forEach(async(campaign) => {
    console.log(campaign);
    const signUps = await getSubmitCounts(campaign._id,campaign.customization.hotStreak);
    let queriedElements = firebase.database().ref(`${token.token}`).orderByKey()
    queriedElements.once('value', itemSnapshot => {
      console.log(itemSnapshot,"itemSnapshot")
    })
  });
}

const insertEvents = (signUps, campaignId, userId) => new Promise((resolve, reject) => {
  const concurrency  = config.firebase.concurrencyLimit;  
  const keys = Object.keys(signUps);
  let count = 0;
  let updates = {}

  async.eachLimit(keys, concurrency, (key, done) => {
    let locationArr = signUps[key].loc.split(",");
    const campaignEvent = new CampaignEvent({
      name: 'get hot streaks',
      campaignId: mongoose.Types.ObjectId(campaignId),
      userId: mongoose.Types.ObjectId(userId),
      type: 'submits',
      data: {
        city: signUps[key].city,
        country: signUps[key].country,
        formData: {
          lastName: signUps[key].lastName
        },
        ip: signUps[key].ip,
        location: {
          lat: locationArr[0],
          long: locationArr[1],
          mapUrl: 'map'
        }
      },
      timestamp: signUps[key].timestamp
    })
    campaignEvent.save(err => {
      if(err){
        console.log(err,"ERROR WHILE SAVING EVENT")
      } else {        
        console.log("Saved event")
        if(count++ < 20){
          updates[key] = signUps[key];
        }
        done()
      }
    });
  }, (err) => err ? reject(err) : resolve(updates))
})