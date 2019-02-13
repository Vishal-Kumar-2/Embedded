import { User } from '../models';

export const createUser = (userData) =>  {
  const user = new User(userData);
  return user.save();
}

export const updateUser = (findBy, updateData) => 
  User.findOneAndUpdate(findBy,
    { '$set': updateData },
    { 'new': true, 'upsert': true, strict: false }
  );

export const findUser = (findBy) => User.find(findBy).lean();
    

