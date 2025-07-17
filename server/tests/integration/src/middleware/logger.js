const winston = require('winston');
const { format } = winston;
const { combine, timestamp, json } = format;

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Request logger middleware
const requestLogger = (req, res, next) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
  next();
};

// Error logger middleware
const errorLogger = (error, req, res, next) => {
  logger.error('HTTP Error', {
    method: req.method,
    url: req.url,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  next(error);
};

// Export all middleware functions
module.exports = {
  requestLogger,
  errorLogger
};
