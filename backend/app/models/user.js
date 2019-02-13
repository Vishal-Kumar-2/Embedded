import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
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
  verified: { type: Boolean , default : false },
  businessPlan: {
    active: Boolean,
    validTill: Date
  },
  profilePic: String,
  sessionToken: { type: String, expires: '48h' }
});

export default mongoose.model('User', UserSchema);
