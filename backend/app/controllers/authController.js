import Responder from '../../lib/expressResponder'
import { User } from '../models';
import { findUser, updateUser } from '../services/user';
import { comparePassword } from '../../lib/bcrypt';
const jwt = require('jwt-simple');

export default class AuthController {
  static updateLoginToken(req, res) {
    let { username, password } = req.body;   

    findUser({ username : username }).then(async(user) => {
      const userObj = user[0];
      if(!userObj)
        Responder.operationFailed(res, { message: 'User does not exist' });
      else {
        const matched = await comparePassword(password, userObj.password);
        if(!matched)
          Responder.operationFailed(res, { message: 'Password and username don\'t match' }) ;
        else {
          const SECRET = `PASSKEY${Date.now()}`;
          const sessionToken = jwt.encode({ username }, SECRET);

          updateUser({ username },{ sessionToken })
          .then((user) => {
            Responder.success(res, user)
          }).catch((err) => {
            Responder.operationFailed(res, { message: err.message || err.reason })
          })
        }
      }
    })
  }

  static updateLogoutToken(req, res) {
    let { username, password } = req.body;
    const timeStamp = Date.now
    User.findAndUpdate({ username },
      { '$set': { sessionToken: '' } },
      { 'new': true, 'upsert': true, strict: false }
    ).then((user) => {
      if (user) {
        Responder.success(res, user)
      } else {
        Responder.operationFailed(res, 'Error: ' + user)
      }
    }).catch((err) => {
      console.log(err);
      Responder.operationFailed(res, { message: err.message || err.reason })
    })
  }
}
