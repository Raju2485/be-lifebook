import models from '../../models/index';
import { hashSync, compareSync } from 'bcrypt';
import { Op }  from 'sequelize';


export const resetPassword = async (req, res) => {
  try {
    const { email, hash, password } = req.body;

    if (!email || !hash || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, hash and password',
      });
    }
    // Checking the existence of email.
    let emailExistence = await models.Users.findOne({
      where: { email: { [Op.iLike]: email } },
      attributes: [
        'id',
        'hash',
        'password'
      ],
    });

    if (!emailExistence) {
      return res.status(400).json({
        success: false,
        message: 'Email does not exist',
      });
    }

    if (emailExistence.hash !== hash) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password reset link',
      });
    }
    else {
      if (emailExistence.password && compareSync(password, emailExistence.password)) {
        return res.status(400).json({
          success: false,
          message: 'New password cannot be the same as the old one',
        });
      } else {
        await emailExistence.update({ hash: "", password: hashSync(password, 10) });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully!',
    });
    //#endregion

  } catch (err) {
    console.log('Error =', err + "");
    return res.status(500).json({ success: false, message: err.message });
  }
};