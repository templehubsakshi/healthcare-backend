const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Authentication required');
  }

  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findByPk(payload.id, { attributes: ['id', 'name', 'email'] });
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  req.user = user;
  next();
});

module.exports = authenticate;
