import mongoose from 'mongoose';
let Schema = mongoose.Schema;
import { createHash } from '../../lib/bcrypt';

const userSchema = new Schema({
  username: { type: String , required : true },
  password: { type: String , required : true },
  id: Schema.Types.ObjectId,
  email: { type: String , required : true },
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

userSchema.pre('save', async function() {
  const user = this;
  if (!user.isModified('password')) return;
  const hash = await createHash(user.password);
  user.password = hash;
});

export default mongoose.model('User', userSchema);
