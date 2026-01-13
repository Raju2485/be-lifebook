import models from '../../models/index';
import config from '../../config/config';
import { sendEmail } from '../../utils/sendEmail2';
import fs from 'fs';
import path from 'path';
import randomstring from "randomstring";
import { Op } from 'sequelize';


export const sendPasswordResetLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) { 
    return res.status(400).json({
      success: false,
      message: 'Please provide email',
    });
    }
    // Checking the existence of email.
    let emailExistence = await models.Users.findOne({
      where: { email: {[Op.iLike]: email} },
      attributes: [
        'id',
        'name',        
      ],
    });
    if (!emailExistence) { 
      return res.status(400).json({
        success: false,
        message: 'Email does not exist',
      });
    }

    let hash = randomstring.generate();
    await emailExistence.update({hash: hash})
    //#region sending email
    let logoPath = `${path.join(
      process.cwd()
    )}/src/assets/logo.png`;
    const logo = `data:image/png;base64, ${fs.readFileSync(logoPath, "base64")}`
          
    const subject = 'Reset your password'
    let recipient_first_name = emailExistence?.name
    let hyperlink = `${config.FE_DOMAIN}/reset-password?email=${email}&hash=${hash}`;
// console.log('hyperlink = ', hyperlink)
    const context = {
      logo,
      recipient_first_name,
      hyperlink
    }
    // Uncomment below line to make the email work.
    // await sendEmail({ toEmail: email, subject, template: 'passwordResetLink', context });

    return res.status(200).json({
      success: true,
      msg: 'Password reset link has been sent to your email',
    });
    //#endregion

  } catch (err) {
    console.log('Error =', err);
      return res.status(500).json({
          success: false,
          msg: 'Something went wrong, we are looking into it',
          error: err.message
      });
  }
};