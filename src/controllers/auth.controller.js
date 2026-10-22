const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) =>
  jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'Email is already registered');
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { id: user.id, name: user.name, email: user.email },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token: signToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    },
  });
});

module.exports = { register, login };
