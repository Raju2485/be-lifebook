import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize';

export const checkIfAccountExistsInOrg = async (
  req: Request,
  res: Response
) => {
  try {
    let { orgId, name: email } = req.query;
    email = email?.toString().trim();

    // getting users
    const isAccountExists = await models.Accounts.findOne({
      where: {
        OrgId: Number(orgId),
        isActive: true,
      },
      include: [
        {
          model: models.Users,
          where: { [Op.or]: [{ email: { [Op.iLike]: `${email}` } }, { name: { [Op.iLike]: `${email}` } }] },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: isAccountExists ? true : false,
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
