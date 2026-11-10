import { Request, Response } from 'express';
import models from '../../models/index';
import { hashSync, compareSync } from 'bcrypt';
import { Op } from 'sequelize';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, hash, password } = req.body;

    if (!email || !hash || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide email, hash and password',
      });
    }
    const emailExistence = await models.Users.findOne({
      where: { email: { [Op.iLike]: email } },
      attributes: ['id', 'hash', 'password', 'hashExpiresAt'],
    });

    if (!emailExistence) {
      return res.status(400).json({
        success: false,
        msg: 'Email does not exist',
      });
    }

    if (emailExistence.hash !== hash) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid password reset link',
      });
    }

    const expiresAt = emailExistence.hashExpiresAt;
    if (expiresAt == null) {
      return res.status(400).json({
        success: false,
        msg: 'Password reset link has expired',
      });
    }

    const hasExpiresAt = new Date(expiresAt);
    const currentDate = new Date();
    if (hasExpiresAt < currentDate) {
      return res.status(400).json({
        success: false,
        msg: 'Password reset link has expired',
      });
    }

    if (
      emailExistence.password &&
      compareSync(password, emailExistence.password)
    ) {
      return res.status(400).json({
        success: false,
        msg: 'New password cannot be the same as the old one',
      });
    }

    await emailExistence.update({
      hash: null,
      hashExpiresAt: null,
      password: hashSync(password, 10),
    });

    return res.status(200).json({
      success: true,
      msg: 'Password reset successfully!',
    });
  } catch (err) {
    console.log('Error =', err);
    return res
      .status(500)
      .json({ success: false, msg: getErrorMessage(err) });
  }
};
