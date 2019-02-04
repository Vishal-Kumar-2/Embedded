import Responder from '../../lib/expressResponder'
import { User } from '../models';
const jwt = require('jwt-simple');

export default class AuthController {
  static updateLoginToken(req, res) {
    let { username, password } = req.body;
    const SECRET = `PASSKEY${Date.now()}`
    const sessionToken = jwt.encode({ username }, SECRET)
    // const sessionToken = username
    User.findOneAndUpdate({ username },
      { '$set': { sessionToken } },
      { 'new': true, 'upsert': true, strict: false, updated: true }
    ).then((user) => {
      console.log(user)
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
