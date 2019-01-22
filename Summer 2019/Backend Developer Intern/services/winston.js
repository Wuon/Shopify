const winston = require('winston');


// initialize winston logger with errors to error.log and other levels to sample.log
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'sample.log' }),
  ],
});

// start sessionId at 0 during server initialization
let sessionId = 0;

// sessionId tracker between every request
module.exports.getSessionId = (user) => {
  sessionId += 1;
  if (logger) {
    logger.info({
      message: `Starting session ${sessionId}`, body: {}, id: sessionId, user: user || 'SYSTEM',
    });
  }
  return sessionId;
};

// info level documentation
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

// error level documentation
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
