import jwt from 'jwt-simple';

export const generateToken = (username) => {
  const SECRET = `PASSKEY${Date.now()}`;
  if(username){
    return jwt.encode({ username }, SECRET)
  } else{
    throw 'Token Creation Failed';
  }
};