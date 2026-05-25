const jwt = require('jsonwebtoken');

import config from '../config/config.ts';

import models from '../models/index.ts';

export const generateTokens = async (user) => {
  try {
    const payload = user;
    let expiresIn: any = '12h';
    if (payload?.exp) {
      expiresIn = payload.exp - Math.floor(Date.now() / 1000);

      delete payload.iat;
      delete payload.exp;
    }

    const accessToken = jwt.sign(payload, config.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn,
    });

    await models.AccessAndRefreshTokens.create({ accessToken, refreshToken });

    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return Promise.reject(error);
  }
};
