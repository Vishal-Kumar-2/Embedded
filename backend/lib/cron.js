import config from 'config';
import Queue from 'bull';
import { hotStreakService } from '../app/services/hotStreak';

let HotstreakQueue = new Queue('save_users_queue', config.REDIS_CONFIG);
let SaveLocationImageQueue = new Queue('save_location_image_queue', config.REDIS_CONFIG);

const startCron = () => {
  HotstreakQueue.process('save_user',(job, done) => {
    hotStreakService();
    done();
  });
  HotstreakQueue.add('save_user',{} ,{
    repeat: {
      cron: '*/20 * * * *'
    }
  });
}

startCron();