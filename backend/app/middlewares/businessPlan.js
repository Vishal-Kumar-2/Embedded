import Responder from '../../lib/expressResponder';
import { ForbiddenError } from '../errors';

const forbiddenError = (msg, res) => Responder.operationFailed(res, new ForbiddenError(msg))

export function isBusinessPlanActive(req, res, next) {
  User.findOneById(req.campaign.userId)
    .then(user => {
      if(user && user.businessPlan && !req.user.businessPlan.active) {
        return forbiddenError('Need Business plan to access this servicec', res);
      }
      next();
    })
    .catch(Responder.operationFailed(res, new Error('Something went wrong')))
}
