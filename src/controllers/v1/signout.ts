import { Request, Response } from 'express';
import models from '../../models/index';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const signout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(' ')[1];

  try {
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        msg: 'Authorization token is required',
      });
    }

    const isExists = await models.AccessAndRefreshTokens.findOne({
      where: { accessToken },
    });

    if (!isExists) {
      return res.status(200).json({
        success: true,
        msg: 'Thanks! You have logged out successfully.',
      });
    }

    await isExists.destroy();
    return res.status(200).json({
      success: true,
      msg: 'Thanks! You have logged out successfully',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: getErrorMessage(err),
    });
  }
};
