import config from 'config';
import Queue from 'bull';
import { getHotstreaks } from '../app/services/hotStreak';

let HotstreakQueue = new Queue('hot_streak_queue', config.REDIS_CONFIG);
let SaveLocationImageQueue = new Queue('save_location_image_queue', config.REDIS_CONFIG);

const startCron = () => {
  HotstreakQueue.process('hotstreaks',(job, done) => {
    getHotstreaks().then(done).catch(err => {
      console.error(err)
    })
  });
  HotstreakQueue.add('hotstreaks',{} ,{
    repeat: {
      cron: '*/20 * * * *'
    }
  });
}

startCron();