const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import config from '../../config/config';
import models from '../../models/index';
import { generateTokens } from '../../utils/generateTokens';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const isExists = await models.AccessAndRefreshTokens.findOne({
      where: { refreshToken },
    });

    if (!isExists) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid refresh token' });
    }

    const tokenDetails = jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET_KEY
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(tokenDetails);

    await isExists.destroy();

    return res.status(200).json({
      success: true,
      message: 'New access token created successfully!',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      metaData: req?.meta ?? null,
    });
  } catch (error) {
    console.log(error);
    const message = getErrorMessage(error);
    if (message === 'jwt expired') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: message,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: 'Something went wrong, we are looking into it',
        error: message,
      });
    }
  }
};
