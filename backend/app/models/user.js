import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
let Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

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

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if(err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
          if(err) return next(err);

          user.password = hash;
          next();
      });
  });
});

export default mongoose.model('User', userSchema);
