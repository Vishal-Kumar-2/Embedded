import config from 'config';
import Queue from 'bull';
import { hotStreakSignups, hotStreakVisits } from '../app/services/hotStreak';

let HotstreakQueue = new Queue('hot_streak_queue', config.REDIS_CONFIG);
let SaveLocationImageQueue = new Queue('save_location_image_queue', config.REDIS_CONFIG);

const startCron = () => {
  HotstreakQueue.process('recent_signups',(job, done) => {
    hotStreakSignups().then(done);
  });
  HotstreakQueue.add('recent_signups',{} ,{
    repeat: {
      cron: '*/20 * * * *'
    }
  });
  HotstreakQueue.process('recent_visits',(job, done) => {
    hotStreakVisits().then(done);
  });
  HotstreakQueue.add('recent_visits',{} ,{
    repeat: {
      cron: '*/20 * * * *'
    }
  });
}

startCron();