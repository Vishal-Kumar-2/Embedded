import Responder from '../../lib/expressResponder';
import { Campaign } from '../models';
import { getSubmitCounts } from '../services/campaignEvent';
import _ from 'lodash';

export default class CampaignController {
  static createCampaign(req, res) {
    const { name, userId, token, customization } = req.body
    const campaign = new Campaign({ name, userId, token, customization });
    campaign.save(err => {
      if (err) return Responder.operationFailed(res, err)
      return Responder.created(res, campaign)
    });
  }

  static getCampaignByToken(req, res) {
    Campaign.findOne({ token: req.params.token.toString() }, (errorOnDBOp, campaign) => {
      if (errorOnDBOp) Responder.operationFailed(res, errorOnDBOp)
      Responder.success(res, campaign)
    })
  }

  static gethotStreak(req, res) {
    let { hotStreak } = req.campaign.customization
    if (!hotStreak.enabled) {
      return Responder.success(res, [])
    }
    getSubmitCounts(req.campaign._id, hotStreak)
      .then(count => {
        let message = { pastHours: hotStreak.pastHours }
        message[hotStreak.type] = count
        Responder.success(res, message)
      })
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static getConversions(req, res) {
    let { hotStreak } = req.campaign.customization
    getSubmitCounts(req.campaign._id, hotStreak)
      .then(count => Responder.success(res, {
        conversionRate: (count / campaign.totalVisited) * 100,
        pastHours: hotStreak.pastHours
      }))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static getAllCampaign(req, res) {
    Campaign.find()
      .then((campaigns) => Responder.success(res, campaigns))
      .catch(errorOnDBOp => Responder.operationFailed(res, errorOnDBOp));
  }

  static deleteCampaignByToken(req, res) {
    console.log(req.params.token.toString())
    Campaign.findOneAndRemove({ token: req.params.token.toString() }, (errorOnDBOp) => {
      if (errorOnDBOp) Responder.operationFailed(res, errorOnDBOp)
      Responder.deleted(res)
    })
  }

  static updateCampaignByToken(req, res) {
    let { name, customization } = req.body;
    Campaign.findOneAndUpdate({ token: req.params.token.toString() },
      { $set: { name: name, customization: customization } },
      { new: true }, (errorOnDBOp, campaign) => {
        if (errorOnDBOp) Responder.operationFailed(errorOnDBOp, campaign)
        else if (campaign) Responder.success(res, campaign)
        Responder.operationFailed(res, 'No campaign found, Invalid token');
      })
  }
}
// const getHotStreakCounts = (campaignId, hotStreak) => {
//   CampaignEvent.aggregate([
//     {}
//   ])
// }

// { signups: 7, visits: 67 }

// CampaignEvent.collection.insert({
//   name: 'get streaks',
//   campaignId: mongoose.Types.ObjectId('5c599c64e69b2c233c3e889b'),
//   userId: mongoose.Types.ObjectId('5c580cee6a0a285c478e5121'),
//   type: 'visits',
//   data: {
//     city: 'Indore',
//     country: 'India',
//     formData: {
//       lastName: 'Vishal test'
//     },
//     ip: '103.9.13.58',
//     location: {
//       lat: '20.593683',
//       long: '78.962883',
//       mapUrl: 'map'
//     }
//   },
//   timestamp: new Date()
// })


