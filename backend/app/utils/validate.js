import Responder from '../../lib/expressResponder';
import { AuthenticationError } from '../errors';
import User from '../models/user';

const BEARER_TOKEN_REGEX = /bearer(\s+)(\s+|\S+)/i;

const isHeaderFormatValid = req => {
  return BEARER_TOKEN_REGEX.test(req.headers.authorization)
}

const getToken = req => BEARER_TOKEN_REGEX.exec(req.headers.authorization)[2]

const throwAuthError = (msg, res) => Responder.operationFailed(res, new AuthenticationError(msg))

export function isAuthTokenValid(req, res, next) {
  if (!isHeaderFormatValid(req)) {
    return throwAuthError('Authorization bearer token required', res);
  }

  User.findOne({ sessionToken: getToken(req) })
    .then((user) => {
      if (!user) {
        return throwAuthError('Invalid/expired auth token passed', res)
      }
      req.user = user.toObject();
      next();
    })
    .catch(err => throwAuthError(err, res))
}
