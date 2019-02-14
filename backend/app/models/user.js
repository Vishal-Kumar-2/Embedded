import mongoose from 'mongoose';
let Schema = mongoose.Schema;
import { createHash } from '../../lib/bcrypt';
const regexFormat = {
  email: /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/,
  phone: /\d{3}-\d{3}-\d{4}/
}

const userSchema = new Schema({
  username: { type: String , required : true },
  password: { 
    type: String , 
    required : true,
    validate: {
      validator: function(v) {
        return regexFormat.password.test(v);
      },
      message: props => `Password must contain a capital letter, a number and a special character. Minimum length is eight characters and maximum length is sixteen.`
    },
  },
  id: Schema.Types.ObjectId,
  email: { 
    type: String , 
    required : true,
    validate: {
      validator: function(v) {
        return regexFormat.email.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
  },
  details: {
    firstName: String,
    lastName: String,
    company: String,
    phone: { 
      type: String , 
      validate: {
        validator: function(v) {
          return regexFormat.phone.test(v);
        },
        message: props => `${props.value} is not a valid phone number`
      },
    },
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

userSchema.pre('update', async function() {
  this.update({}, { password: await createHash(this.getUpdate().$set.password) } );
});

export default mongoose.model('User', userSchema);
