const jwt = require('jsonwebtoken');

import config from '../config/config.ts';

exports.generateTokens = async (user: {}) => {
  try {
    const payload = user;

    const accessToken = jwt.sign(payload, config.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: '12h',
    });

    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return Promise.reject(error);
  }
};