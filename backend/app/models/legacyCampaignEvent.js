import mongoose from 'mongoose';
import { CampaignEventSchema } from '../models/campaignEvent';

export default mongoose.model('LegacyCampaignEvent',CampaignEventSchema);
