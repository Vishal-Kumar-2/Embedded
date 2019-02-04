import Responder from '../../lib/expressResponder';
import { ParameterInvalidError } from '../errors';
import { Campaign } from '../models';

const notFoundError = (msg, res) => Responder.operationFailed(res, new ParameterInvalidError(msg))

export function verifyToken(req, res, next) {
  Campaign.findOne({ token: req.params.token })
    .then(campaign => {
      if(!campaign) {
        return notFoundError('Campaign not found', res);
      }
      req.campaign = campaign;
      next();
    })
    .catch(Responder.operationFailed(res, new Error('Something went wrong')))
}
