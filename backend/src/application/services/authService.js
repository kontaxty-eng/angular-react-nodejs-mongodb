const bcrypt = require('bcryptjs');
const userRepository = require('../../infrastructure/repositories/userRepository');
const { signToken, verifyToken } = require('../../infrastructure/security/jwt');
const AppError = require('../errors/AppError');

const register = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Email and password required', 400);
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.create({ email: email.toLowerCase(), passwordHash });
  const token = signToken(user);

  return { token, email: user.email };
};

const login = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Email and password required', 400);
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signToken(user);
  return { token, email: user.email };
};

const getProfile = async (token) => {
  if (!token) {
    throw new AppError('Missing token', 401);
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    throw new AppError('Invalid token', 401);
  }

  const user = await userRepository.findById(payload.sub);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { email: user.email };
};

module.exports = {
  register,
  login,
  getProfile
};
