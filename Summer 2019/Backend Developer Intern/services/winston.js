const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'sample.log' }),
  ],
});

let sessionId = 0;

module.exports.getSessionId = (user) => {
  sessionId += 1;
  if (logger) {
    logger.info({
      message: `Starting session ${sessionId}`, body: {}, id: sessionId, user: user || 'SYSTEM',
    });
  }
  return sessionId;
};

module.exports.info = (message, body, obj = {}, origin = 'API') => {
  const logObject = {
    sessionId: obj.id || module.exports.getSessionId(),
    level: 'info',
    message,
    body,
    origin,
    user: obj.user || 'Unknown user',
  };
  if (logger) {
    logger.info(logObject);
  }
};

module.exports.error = (message, body, obj = {}, origin = 'API') => {
  const logObject = {
    sessionId: obj.id || module.exports.getSessionId(),
    level: 'error',
    message,
    body,
    origin,
    user: obj.user || 'Unknown user',
  };
  if (logger) {
    logger.error(logObject);
  }
};
