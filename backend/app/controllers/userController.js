import Responder from '../../lib/expressResponder'
import request from '../../lib/request'
import Express from '../../lib/express';
import { User } from '../models';
import mongoose from 'mongoose';

const bodyParser = require("body-parser");

//const OAUTH = '9c199ea13f47bfb54d06fe006587a8fb06cb22b1'
//const query = { access_token: OAUTH }
const query = {}
export default class UserController {
  static createUser(req, res) {
    let { email, verified, details, accountStatus, businessPlan, profilePic } = req.body;
    User.collection.insertOne({ email, verified, details, accountStatus, businessPlan, profilePic })
      .then(newUser => Responder.created(res, newUser))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
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
    User.findByIdAndUpdate(
      id,
      { '$set': { email, verified } },
      { 'new': true, 'upsert': true, strict: false }
    ).then((docs) => {
      if (docs) {
        console.log(docs);

        Responder.success(res, docs)
      } else {
        console.log(docs)
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
