import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CampaignEventSchema = new Schema({
  campaign: {
    name: String,
    campaignId: [{ type: Schema.Types.ObjectId, ref: 'Campaign' }],
    userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String },
    data: {
      city: String,
      country: String,
      ip: { type: String, required: true},
      location: {
        lat: String,
        long: String,
        mapUrl: String
      }
    },
    timestamp: { type: Date, default: Date.now }
  }
});

export default mongoose.model('CampaignEvent', CampaignEventSchema);
