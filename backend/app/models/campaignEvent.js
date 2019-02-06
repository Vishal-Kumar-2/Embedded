import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CampaignEventSchema = new Schema({
  name: String,
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, default: 'conversions', enum: ['conversions', 'visits', 'submits'] },
  data: {
    city: String,
    country: String,
    formData: JSON,
    ip: { type: String, required: true },
    location: {
      lat: String,
      long: String,
      mapUrl: String
    }
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('CampaignEvent', CampaignEventSchema);
