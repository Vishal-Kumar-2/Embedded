import { User } from '../models';

export const createUser = (userData) =>  {
  const user = new User(userData);
  return user.save();
}

export const updateUser = (_id, updateData) => 
  User.findOneAndUpdate({ _id },
    { '$set': updateData },
    { 'new': true, 'upsert': true, strict: false }
  );

