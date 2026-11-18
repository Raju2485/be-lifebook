import { Request, Response } from 'express';
import models from '../../models/index';
import { Op } from 'sequelize';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const checkIfAccountExistsInOrg = async (
  req: Request,
  res: Response
) => {
  try {
    const { orgId } = req.query;
    let { name } = req.query;
    name = name?.toString().trim();

    // getting users
    const isAccountExists = await models.Accounts.findOne({
      where: {
        OrgId: Number(orgId),
        [Op.or]: [
          { name: { [Op.iLike]: name } },
          { '$User.handle$': { [Op.iLike]: name } },
        ],
      },
      include: [
        {
          model: models.Users,
          required: false,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: !!isAccountExists,
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
