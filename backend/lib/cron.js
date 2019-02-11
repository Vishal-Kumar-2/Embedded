import config from 'config';
import Queue from 'bull';
import { getHotstreaks } from '../app/services/hotStreak';
import { removeGarbageData } from '../app/services/cronService';

let HotstreakQueue = new Queue('hot_streak_queue', config.REDIS_CONFIG);
let LegacyCollectionQueue = new Queue('legacy_queue', config.REDIS_CONFIG);

const startCron = () => {
  HotstreakQueue.process('hotstreaks',(job, done) => {
    getHotstreaks().then(done).catch(err => {
      console.error(err)
    })
  });
  LegacyCollectionQueue.process('garbage_collection',(job, done) => {
    removeGarbageData().then(done).catch(err => {
      console.error(err)
    })
  });
  HotstreakQueue.add('hotstreaks',{} ,{
    repeat: {
      cron: '*/20 * * * *'
    }
  });
  LegacyCollectionQueue.add('garbage_collection',{} ,{
    repeat: {
      cron: '0 0 0 * * *'
    }
  });
}

startCron();