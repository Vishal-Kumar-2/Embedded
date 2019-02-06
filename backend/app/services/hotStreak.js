import { Campaign } from '../models';
import async from 'async';
import config from 'config';
import firebase from '../../lib/firebase';

export function hotStreakService() {
  return new Promise((resolve, reject) => {
    getCampaignTokens()
      .then(processFirebaseData)
      .then(resolve)
      .catch(err => {
        console.error('HOT STREAK CRON: Error while processing Firebase data')
        console.error(err)
      })
  })
}

const getCampaignTokens = () => Campaign.find({}).select({'campaign.token': 1, }).lean();

const processFirebaseData = (tokens) => new Promise((resolve, reject) => {
  const concurrency  = config.firebase.concurrencyLimit;
  async.eachLimit(tokens, concurrency, (token, done) => {
    queriedElements = firebase.ref(`${token}/recentActivites`).orderByKey();
    let count = 0;
    queriedElements.once('value', itemSnapshot => {
      if(count++ > 20) {
        itemSnapshot.ref.remove();
      }
    })
  }, (err) => err ? reject(err) : resolve())
})