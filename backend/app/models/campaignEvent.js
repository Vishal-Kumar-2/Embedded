import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const CampaignEventSchema = new Schema({
  name: String,
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, default: 'totalSigned', enum: ['totalSigned', 'totalVisited'] },
  data: {
    dataFireBaseId: { type: String, unique: true, required: true },
    city: String,
    country: String,
    formData: JSON,
    ip: { type: String },
    location: {
      lat: String,
      long: String,
      mapUrl: String
    }
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('CampaignEvent', CampaignEventSchema);
