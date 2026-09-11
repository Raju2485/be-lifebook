import models from '../../models/index';
import config from '../../config/config';
import { sendEmail } from '../../utils/sendEmail2';
import fs from 'fs';
import path from 'path';
import randomstring from 'randomstring';
import { Op } from 'sequelize';
  import {
    HumanizeDurationLanguage,
    HumanizeDuration,
  } from 'humanize-duration-ts';

const humanizeDuration = new HumanizeDuration(new HumanizeDurationLanguage());
const momentz = require('moment-timezone');

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
      where: { email: { [Op.iLike]: email } },
      attributes: ['id', 'name'],
    });
    if (!emailExistence) {
      return res.status(400).json({
        success: false,
        message: 'Email does not exist',
      });
    }

    let hash = randomstring.generate();
    const hashValidityInMilliSeconds = 1000 * 60 * 5;
    const humanizedDurationInMinutes = humanizeDuration.humanize(
      hashValidityInMilliSeconds,
      {
        language: 'en',
        round: true,
        units: ['m'],
        largest: 1,
      }
    );
    await emailExistence.update({
      hash: hash,
      hashExpiresAt: momentz(new Date()).add(hashValidityInMilliSeconds, 'milliseconds').format(),
    });
    //#region sending email
    let logoPath = `${path.join(process.cwd())}/src/assets/logo.png`;
    const logo = `data:image/png;base64, ${fs.readFileSync(logoPath, 'base64')}`;

    const subject = 'Reset your password';
    let recipient_first_name = emailExistence?.name;
    let hyperlink = `${config.FE_DOMAIN}/resetPassword?email=${email}&hash=${hash}`;
    // console.log('hyperlink = ', hyperlink)
    const context = {
      logo,
      recipient_first_name,
      hyperlink,
      humanizedDurationInMinutes,
    };
    // Uncomment below line to make the email work.
    await sendEmail({
      toEmail: email,
      subject,
      template: 'passwordResetLink',
      context,
    });

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
      error: err.message,
    });
  }
};
