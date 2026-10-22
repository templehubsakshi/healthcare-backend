const ApiError = require('../utils/ApiError');

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    throw new ApiError(400, 'Validation failed', error.details.map((d) => d.message));
  }
  req.body = value;
  next();
};

const validateIdParam = (name = 'id') => (req, res, next) => {
  const value = Number(req.params[name]);
  if (!Number.isInteger(value) || value < 1) {
    throw new ApiError(400, `Invalid ${name}`);
  }
  req.params[name] = value;
  next();
};

module.exports = { validateBody, validateIdParam };
