import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user: {
    id: Schema.Types.ObjectId,
    email: String,
    details: {
      firstName: String,
      lastName: String,
      company: String,
      phone: String,
    },
    locale: String,
    accountStatus: String,
    verified: Boolean,
    businessPlan: {
      active: Boolean,
      validTill: Date
    },
    profilePic: String,
  }
});

export default mongoose.model('User', UserSchema);
