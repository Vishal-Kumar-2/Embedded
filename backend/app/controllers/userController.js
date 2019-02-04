import Responder from '../../lib/expressResponder'
import { User } from '../models';

export default class UserController {
  static createUser(req, res) {
    let { email, verified, details, accountStatus, businessPlan, profilePic } = req.body;
    User.collection.insertOne({ email, verified, details, accountStatus, businessPlan, profilePic })
      .then(newUser => Responder.created(res, newUser))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static updateLoginToken(req, res) {
    let { username, password } = req.body;
    const timeStamp = Date.now
    User.findAndUpdate({ username },
      { '$set': { sessionToken: jwt.encode({ username, timeStamp, password, }), verified } },
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

  static getAllUser(req, res) {
    User.find()
      .then((data) => Responder.success(res, data))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static getUserById(req, res) {
    const { id } = req.params
    User.findOne({ _id: id })
      .then((data) => Responder.success(res, data))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static updateUserById(req, res) {
    let { id } = req.params
    let { email, verified } = req.body;
    User.findByIdAndUpdate(id,
      { '$set': { email, verified } },
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

  static deleteUser(req, res) {
    let { id } = req.params;
    User.findOneAndRemove({ _id: id })
      .then(res => Responder.deleted(res))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }
}
