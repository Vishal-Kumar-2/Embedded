import { Campaign, CampaignEvent } from '../models';
import { getSubmitCounts } from './campaignEvent';
import async from 'async';
import mongoose from 'mongoose';
import config from 'config';
import firebase from '../../lib/firebase';

export function hotStreakSignups() {
  const type = 'recentActivities';
  getHotstreaks(type);
}

export function hotStreakVisits() {
  const type = 'recentVisits';
  getHotstreaks(type);
}

const getHotstreaks = function(type) {
  return new Promise((resolve, reject) => {
    getCampaignTokens()
      .then((tokens) => processFirebaseData(type, tokens))
      .then(getCampaignHotStreak)
      .then(setLastSignups)
      .then(resolve)
      .catch(err => {
        console.error('HOT STREAK CRON: Error while processing Firebase data')
        console.error(err)
        reject(err)
      })
  })
}

const getCampaignTokens = () => Campaign.find({}).select({'token': 1, '_id': 1, 'userId': 1, 'customization.showLast': 1}).lean();
const getCampaignHotStreak = () => Campaign.find({}).select({'token': 1, '_id': 1, 'customization.hotStreak': 1}).lean();

const processFirebaseData = (type, tokens) => new Promise((resolve, reject) => {
  const concurrency  = config.firebase.concurrencyLimit;
  async.eachLimit(tokens, concurrency, (token, done) => {
    let queriedElements = firebase.database().ref(`${token.token}/${type}`).orderByKey();
    const hotStreaktype = (type == 'recentActivities') ? 'submits' : 'visits';
    queriedElements.once('value', itemSnapshot => {
      const refData = itemSnapshot.val();
      insertEvents(refData, token._id, token.userId, token.customization.showLast, hotStreaktype).then((updates) => {
        itemSnapshot.ref.set(updates);
        done();
      });
    })
  }, (err) => err ? reject(err) : resolve())
})

const setLastSignups = (campaigns) => {
  campaigns.forEach(async(campaign) => {
    const count = await getSubmitCounts(campaign._id,campaign.customization.hotStreak);
    const endPoint = (campaign.customization.hotStreak.type == 'submits') ? 'totalSigned' : 'totalVisited';
    let totalRef = firebase.database().ref(`${campaign.token}/${endPoint}`);
    totalRef.once('value', (itemsnapshot) => {
      totalRef.ref.set(count);
    })
  });
}

const insertEvents = (refData, campaignId, userId, showLast, hotStreaktype) => new Promise((resolve, reject) => {
  const concurrency  = config.firebase.concurrencyLimit;
  if(refData){
    const keys = Object.keys(refData);
    let count = 0;
    let updates = {}

    async.eachLimit(keys, concurrency, (key, done) => {
      let locationArr = (refData[key].loc) ? refData[key].loc.split(",") : [];
      const campaignEvent = new CampaignEvent({
        name: 'hot streaks',
        campaignId: mongoose.Types.ObjectId(campaignId),
        userId: mongoose.Types.ObjectId(userId),
        type: hotStreaktype,
        data: {
          city: refData[key].city,
          country: refData[key].country,
          formData: {
            lastName: refData[key].lastName
          },
          ip: refData[key].ip,
          location: {
            lat: (locationArr[0]) ? (locationArr[0]) : '',
            long: (locationArr[1]) ? (locationArr[1]) : '',
            mapUrl: 'map'
          }
        },
        timestamp: refData[key].timestamp
      })
      campaignEvent.save(err => {
        if(err){
          console.log(err,"ERROR WHILE SAVING EVENT")
        } else {        
          if(count++ < showLast){
            updates[key] = refData[key];
          }
          done()
        }
      });
    }, (err) => err ? reject(err) : resolve(updates))
  } else{
    resolve({})
  }  
}).catch(err => {
  console.error(err)
})