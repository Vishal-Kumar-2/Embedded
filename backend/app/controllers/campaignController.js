import Responder from '../../lib/expressResponder';
import { Campaign } from '../models';
import { getSubmitCounts } from '../services/campaignEvent';
import _ from 'lodash';

export default class CampaignController {
  static createCampaign(req, res) {
    const { name, userId, token, customization } = req.body
    maintainSupportedCard(customization)
      .then((customization) => {
        const campaign = new Campaign({ name, userId, token, customization });
        campaign.save(err => {
          if (err) return Responder.operationFailed(res, err)
          return Responder.created(res, campaign)
        });
      })
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

const maintainSupportedCard = (customization) => {
  return new Promise(resolve => {
    if (customization.hotStreak.type === 'totalSigned')
      customization.supportedCards = customization.supportedCards.filter(item => item !== 'totalVisited')
    customization.supportedCards = customization.supportedCards.filter(item => item !== 'totalSigned')
    resolve(customization);
  })
}
