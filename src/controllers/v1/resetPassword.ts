import models from '../../models/index';
import { hashSync, compareSync } from 'bcrypt';
import { Op }  from 'sequelize';


export const resetPassword = async (req, res) => {
  try {
    const { email, hash, password } = req.body;

    if (!email || !hash || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide email, hash and password',
      });
    }
    // Checking the existence of email.
    let emailExistence = await models.Users.findOne({
      where: { email: { [Op.iLike]: email } },
      attributes: [
        'id',
        'hash',
        'password',
        'hashExpiresAt'
      ],
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
    const hasExpiresAt = new Date(emailExistence.hashExpiresAt);
    const currentDate = new Date();
    console.log('hasExpiresAt = ', hasExpiresAt);
    console.log('currentDate = ', currentDate);
    if (hasExpiresAt && hasExpiresAt < currentDate) {
      return res.status(400).json({
        success: false,
        msg: 'Password reset link has expired',
      });
    } else {
      if (
        emailExistence.password &&
        compareSync(password, emailExistence.password)
      ) {
        return res.status(400).json({
          success: false,
          msg: 'New password cannot be the same as the old one',
        });
      } else {
        await emailExistence.update({
          hash: null,
          hashExpiresAt: null,
          password: hashSync(password, 10),
        });
      }
    }

    return res.status(200).json({
      success: true,
      msg: 'Password reset successfully!',
    });
    //#endregion

  } catch (err) {
    console.log('Error =', err + "");
    return res.status(500).json({ success: false, msg: err.message });
  }
};