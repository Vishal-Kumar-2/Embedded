import Responder from '../../lib/expressResponder';
import { Campaign } from '../models';
import _ from 'lodash';

export default class CampaignController {
  static createCampaign(req, res) {
    let { userId, name, token, customization } = req.body;
    Campaign.collection.insertOne({ userId, name, token, customization })
      .then(newCampaign => Responder.created(res, newCampaign))
      .catch(errorOnDBOp => {
        Responder.operationFailed(res, errorOnDBOp)
      });
  }

  static getCampaignByToken(req, res) {
    let { token, user } = req.query;
    Campaign.findOne({ token, userId: user })
      .then((campaign) => Responder.success(res, campaign))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static getAllCampaign(req, res) {
    Campaign.find()
      .then((campaign) => {
        Responder.success(res, campaign)
      })
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static deleteCampaignByToken(req, res) {
    let token = req.query.token;
    Campaign.findOneAndRemove({ token: null })
      .then(back => Responder.deleted(res))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static updateCampaignByToken(req, res) {
    let token = req.query.token;
    let { name, customization } = req.body;

    Campaign.findOneAndUpdate({ token }, {
      $set: {
        name, customization
      }
    },
      { new: true })
      .then((docs) => {
        if (docs) {
          Responder.success(res, campaign)
        } else {
          Responder.operationFailed(res, docs);
        }
      }).catch((err) => {
        reject(err);
      })
  }

  static customizeCard(req, res) {
    const token = req.query;

    const tokens = {
      'abc': {
        supportedCards: ['pageVisit', 'recentlySigned', 'totalSigned'],
        appearFrom: 'topRight',
        user_id: 45,
        initialCard: 'pageVisit',
        modalHTML: {
          pageVisit: {
            image: 'http://chittagongit.com//images/timeline-icon/timeline-icon-22.jpg',
            msg: `<b class='count'>0 </b>has visited this site. <br>`,
          },
          recentlySigned: {
            image: 'https://static1.squarespace.com/static/525dcddce4b03a9509e033ab/t/526800ffe4b0ee2599668050/1382547712599/fire.png',
            msg: `<b> Lisa from California </b>signed up recently.</br>`,
          },
          totalSigned: {
            image: 'http://chittagongit.com//images/students-icon/students-icon-4.jpg',
            msg: `<b>100 totalSigned </b> have signed up this page.</br>`,
          }
        }
      },
      'def': {
        supportedCards: ['pageVisit', 'recentlySigned'],
        appearFrom: 'bottomRight',
        user_id: 45,
        initialCard: 'pageVisit',
        modalHTML: {
          pageVisit: {
            image: 'http://chittagongit.com//images/icon-for-fire/icon-for-fire-23.jpg',
            msg: `<b class='count'> count </b>has visited this site. <br>`,
          },
          recentlySigned: {
            image: 'https://static1.squarespace.com/static/525dcddce4b03a9509e033ab/t/526800ffe4b0ee2599668050/1382547712599/fire.png',
            msg: `<b>  from city </b>signed up recently.</br>`,
          }
        }
      }
    }

    Responder.success(res, tokens[token]);
  }
}
