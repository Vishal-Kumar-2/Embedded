import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  campaign: {
    name: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Campaign must belong to valid user'] },
    token: { type: String, unique: true, required: true },
    customization: {
      hotStreak: {
        enabled: Boolean,
        pastHours: Number
      },
      supportedCards: [String],
      appearFrom: { type: String, default: 'bottomLeft', enum: ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] },
      initialCard: { type: String, default: 'pageVisit', enum: ['pageVisit', 'recentlyVisited', 'totalSigned', 'liveNowModal'] },
      theme: { type: String, default: 'rounded', enum: ['boxy', 'rounded'] },
      direction: { type: String, default: 'bounceBottom', enum: ['bounceTop', 'bounceBottom'] },
      captureLinks: [String],
      targetLinks: [String],
      notification: {
        firstDelay: { type: Number, default: 0 },
        duration: { type: Number, default: 7000 },
        timeGapBetweenEach: { type: Number, default: 3000 },
        transitionTime: { type: Number, default: 400 }
      },
      liveNowNotLoop: { type: Boolean, default: false },
      pageVisitNotLoop: { type: Boolean, default: false },
      recentActivityNotLoop: { type: Boolean, default: false },
      modalHTML: [{
        image: String,
        message: String,
        label: { type: String, enum: ['liveNowModal', 'pageVisit', 'totalSigned', 'recentActivities'] },
      }]
    }
  }
});

export default mongoose.model('Campaign', CampaignSchema);
