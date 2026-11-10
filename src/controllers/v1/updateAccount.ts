import { Request, Response } from 'express';
import models from '../../models/index';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Accounts } from '../../models/accounts';

type AccountsWithRoles = Accounts & {
  setRoles: (roleIds: number[]) => Promise<unknown>;
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const { account, orgId } = req.body;

    if (!account || !orgId) {
      return res.status(400).json({
        success: false,
        msg: 'account and orgId are mandatory',
        metaData: req?.meta ?? null,
      });
    }
    const { id, RolesIds, isAdjustAcc } = account;

    const isExists = await models.Accounts.findOne({
      where: {
        id: id,
        OrgId: orgId,
      },
    });

    if (isExists) {
      const accountRow = isExists as AccountsWithRoles;
      if (isAdjustAcc !== undefined) {
        await isExists.update({ isAdjustAcc } as Parameters<Accounts['update']>[0]);
      }
      await accountRow.setRoles([]);
      await accountRow.setRoles(RolesIds ?? []);

      return res.status(200).json({
        success: true,
        msg: 'Account updated successfully!',
        metaData: req?.meta ?? null,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: 'Account not found',
        metaData: req?.meta ?? null,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: getErrorMessage(err),
    });
  }
};
