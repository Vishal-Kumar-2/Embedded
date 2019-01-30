import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  campaign: {
    name: String,
    userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    token: { type: String, unique: true },
    customization: {
      supportedCards: [String],
      appearFrom: { type: String, default: 'bottomLeft', enum: ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] },
      initialCard: { type: String, default: 'pageVisit', enum: ['pageVisit', 'recentlyVisited', 'totalSigned', 'liveNowModal'] },
      theme: { type: String, default: 'rounded', enum: ['boxy', 'rounded'] },
      direction: { type: String, default: 'down', enum: ['up', 'down'] },
      showDirection: String,
      hideDirection: String,
      captureLinks: [String],
      targetLinks: [String],
      notification: {
        firstDelay: { type: Number, default: 0 },
        duration: { type: Number, default: 7000 },
        timeGapBetweenEach: { type: Number, default: 3000 },
        transitionTime: { type: Number, default: 400 }
      },
      liveNowNotLoop: { type: Boolean, default: false },
      pageVisitNotLoop: { type: Boolean, default: false }, // will show only once
      recentActivityNotLoop: { type: Boolean, default: false },
      modalHTML: {
        liveNowModal: {
          image: String,
          message: String,
        },
        pageVisit: {
          image: String,
          message: String,
        },
        totalSigned: {
          image: String,
          setMessage: String,
        },
        recentActivities: {
          image: String,
          message: String,
        },
      }
    }
  }
});

export default mongoose.model('Campaign', CampaignSchema);
