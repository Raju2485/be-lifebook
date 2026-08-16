import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize';

export const checkIfUserExists = async (
  req: Request,
  res: Response
) => {
  try {
    let { email } = req.query;
    email = email?.toString().trim();

    // getting users
    const isUserExists = await models.Users.findOne({
      where: {
        email: { [Op.iLike]: `${email}` },
      },
    });

    return res.status(200).json({
      success: true,
      data: isUserExists ? true : false,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: err.message,
    });
  }
};
