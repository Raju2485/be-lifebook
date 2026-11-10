import { Request, Response } from 'express';
import { compare } from 'bcrypt';
import models from '../../models/index';
import bcrypt from 'bcrypt';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        msg: 'Unauthorized',
      });
    }
    const { email } = req.user;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide old password and new password',
      });
    }
    if (oldPassword == newPassword) {
      return res.status(400).json({
        success: false,
        msg: 'New password cannot be the same as old password',
      });
    }

    const emailExistence = await models.Users.findOne({
      where: { email },
      attributes: ['id', 'password', 'isActive'],
    });

    if (!emailExistence) {
      return res.status(400).json({
        success: false,
        msg: 'User not found',
      });
    }

    if (emailExistence.isActive === false) {
      return res.status(500).json({
        success: false,
        msg: 'Your account has been deactivated. Please contact the administrator',
      });
    }

    const storedPassword = emailExistence.password ?? '';
    const isPasswordCorrect = await compare(oldPassword, storedPassword);

    if (isPasswordCorrect) {
      await models.Users.update(
        {
          password: bcrypt.hashSync(newPassword, 10),
        },
        {
          where: { id: emailExistence.id },
        }
      );
      return res.status(200).json({
        success: true,
        msg: 'Password changed successfully!',
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: 'Incorrect old password',
      });
    }
  } catch (err) {
    console.log('Error =', err);
    return res.status(500).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: getErrorMessage(err),
    });
  }
};
