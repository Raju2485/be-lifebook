import { Request, Response } from 'express';
import models from '../../models/index';
import { Op } from 'sequelize';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const checkIfUserExists = async (
  req: Request,
  res: Response
) => {
  try {
    let { handle } = req.query;
    handle = handle?.toString().trim();

    // getting users
    const isUserExists = await models.Users.findOne({
      where: {
        handle: { [Op.iLike]: `${handle}` },
      },
    });

    return res.status(200).json({
      success: true,
      data: !!isUserExists,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: getErrorMessage(err),
    });
  }
};
