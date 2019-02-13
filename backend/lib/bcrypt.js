import bcrypt from 'bcrypt';
import { Promise } from 'mongoose';
const SALT_WORK_FACTOR = 10;

export const createHash = (data) => new Promise((resolve, reject) => {
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if(err) reject(err);

    bcrypt.hash(data, salt, (err, hash) => {
      if(err) reject(err);
      resolve(hash);
    });
  });
});

export const comparePassword = (password, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (err, res) => {
    if(err) {
      reject(err);
    } else {
      resolve(res);
    } 
  });
});
