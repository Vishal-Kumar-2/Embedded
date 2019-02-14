import Responder from '../../lib/expressResponder'
import { User } from '../models';
import { createUser, updateUser } from '../services/user';
import { generateToken } from '../../lib/jwt';

export default class UserController {

  static signUp(req, res) {
    createUser(req.body)
    .then((data) => {
      const createdUser = data;
      const token = generateToken(createdUser.username);
      updateUser({ _id : createdUser._id }, { "sessionToken" : token })
      .then(Responder.success(res,{ "token" : token }))
    })
    .catch(err => {
      console.log("Error In User SignUp",err);
      Responder.operationFailed(res, err);
    })
  }

  static getAllUser(req, res) {
    User.find()
      .then((data) => Responder.success(res, data))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static getUserById(req, res) {
    const { id } = req.params
    User.findById(id, (errorOnDBOp, data) => {
      if (errorOnDBOp) Responder.operationFailed(res, errorOnDBOp)
      Responder.success(res, data)
    })
  }

  static updateUserById(req, res) {
    let { id } = req.params
    let updateData = req.body;

    User.update(
      { _id: id },
      { '$set': updateData },
      { 'new': true, 'upsert': true, strict: false }
    ).then((user) => {
      if(user)
        Responder.success(res, { message: "Updated user successfully" })
    }).catch((err) => {
      console.log(err);
      Responder.operationFailed(res, { message: err.message || err.reason })
    })
  }

  static deleteUser(req, res) {
    let { id } = req.params;
    User.findOneAndRemove({ _id: id })
      .then(() => Responder.deleted(res))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }
}
