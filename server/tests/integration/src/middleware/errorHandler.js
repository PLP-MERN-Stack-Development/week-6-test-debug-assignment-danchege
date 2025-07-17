const { logger } = require('./logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error Handler', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Set HTTP status code
  const statusCode = err.statusCode || 500;

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: statusCode
    }
  });
};

module.exports = errorHandler;
