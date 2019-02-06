import Responder from '../../lib/expressResponder';
import { ParameterInvalidError } from '../errors';
import { Campaign } from '../models';

const notFoundError = (msg, res) => Responder.operationFailed(res, new ParameterInvalidError(msg))

export function verifyToken(req, res, next) {
  Campaign.findOne({ token: req.params.token.toString() }, function (err, campaign) {
    if (err) Responder.operationFailed(res, new Error('Something went wrong'))
    if (!campaign) {
      return notFoundError('Campaign not found', res);
    }
    req.campaign = campaign.toObject();
    next();
  })
}
// "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.MI6iJHPeMzBHL5PLyy2IRumuPsFGJx7D7VqbNsMMoR4"
// "_id": "5c5981e3ea7107bdec369211",
