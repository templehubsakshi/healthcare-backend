const jwt = require('jsonwebtoken');

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  let details = err.details;

  if (err instanceof jwt.TokenExpiredError) {
    status = 401;
    message = 'Token expired, please log in again';
  } else if (err instanceof jwt.JsonWebTokenError) {
    status = 401;
    message = 'Invalid token';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Record already exists';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON';
  }

  if (status >= 500) {
    console.error(err);
    message = 'Something went wrong on our side';
    details = undefined;
  }

  res.status(status).json({ success: false, message, ...(details && { details }) });
};

module.exports = { notFound, errorHandler };
