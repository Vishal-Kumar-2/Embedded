import { User } from '../models';

export const createUser = (userData) => User.collection.insertOne(userData);

export const updateUser = (_id, updateData) => 
  User.findOneAndUpdate({ _id },
    { '$set': updateData },
    { 'new': true, 'upsert': true, strict: false }
  );

