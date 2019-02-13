import config from 'config';
import Queue from 'bull';
import logger from '../lib/logger';
import { getHotstreaks } from '../app/services/hotStreak';
import { removeGarbageData } from '../app/services/cronService';

let HotstreakQueue = new Queue('hot_streak_queue', config.REDIS_CONFIG);
let LegacyCollectionQueue = new Queue('legacy_queue', config.REDIS_CONFIG);

const startCron = () => {
  HotstreakQueue.process('hotstreaks',(job, done) => {
    getHotstreaks().then(done).catch(err => {
      logger.error(err);
    })
    logger.info('HotStreak Cron Started');
  });
  LegacyCollectionQueue.process('garbage_collection',(job, done) => {
    removeGarbageData().then(done).catch(err => {
      logger.error(err);
    })
    logger.info('Legacy Cron Started');
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