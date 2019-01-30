import Responder from './expressResponder'

const verifyToken = (req,res,next) => {
  if (typeof req.headers.authorization !== 'string') {
    res.sendStatus(400);
    return;
  }
  var tokens = req.headers.authorization.split(' ');
  if (tokens.length < 2) {
    Responder.operationFailed(res, 'Token validation failed')
  }
  var token = tokens[1];
  if(token == req.query.token) {
    next();
  }
  else
    res.sendStatus(403);
  }

module.exports = verifyToken;
