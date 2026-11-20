import { Request, Response } from 'express';
import models from '../../models/index';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { Op } from 'sequelize';

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { accounts, orgId } = req.body;

    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      return res.status(400).json({
        success: false,
        msg: 'accounts must be an array and cannot be empty',
        metaData: req?.meta ?? null,
      });
    }

    for (let i = 0; i < accounts.length; i++) {
      const { name, AccCategsM_Id, natureOfAccount, UserId } = accounts[i];

      const objToCreate = {
        name: name,
        OrgId: Number(orgId),
        AccCategsM_Id,
        natureOfAccount,
        UserId,
      };

      const whereConditions = {
        name: {[Op.iLike]: name},
        OrgId: Number(orgId),
      };
      if (UserId) {
        whereConditions[Op.and] = [
          { UserId: Number(UserId) },
        ];
      }

      const isExists = await models.Accounts.findOne({
        where: whereConditions,
      });

      if (!isExists) {
        await models.Accounts.create(objToCreate);
        }
    }

    return res.status(200).json({
      success: true,
      msg: 'Account(s) created successfully!',
      metaData: req?.meta ?? null,
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
