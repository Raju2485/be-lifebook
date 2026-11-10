import { Request, Response } from 'express';
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
import moment from 'moment-timezone';
import { getErrorMessage } from '../../utils/getErrorMessage';

const humanizeDuration = new HumanizeDuration(new HumanizeDurationLanguage());

export const sendPasswordResetLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }
    const emailExistence = await models.Users.findOne({
      where: { email: { [Op.iLike]: email } },
      attributes: ['id', 'name'],
    });
    if (!emailExistence) {
      return res.status(400).json({
        success: false,
        message: 'Email does not exist',
      });
    }

    const hash = randomstring.generate();
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
      hashExpiresAt: moment(new Date())
        .add(hashValidityInMilliSeconds, 'milliseconds')
        .toDate(),
    });

    const logoPath = `${path.join(process.cwd())}/src/assets/logo.png`;
    const logo = `data:image/png;base64, ${fs.readFileSync(logoPath, 'base64')}`;

    const subject = 'Reset your password';
    const recipient_first_name = emailExistence?.name;
    const hyperlink = `${config.FE_DOMAIN}/resetPassword?email=${email}&hash=${hash}`;
    const context = {
      logo,
      recipient_first_name,
      hyperlink,
      humanizedDurationInMinutes,
    };
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
  } catch (err) {
    console.log('Error =', err);
    return res.status(500).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: getErrorMessage(err),
    });
  }
};
