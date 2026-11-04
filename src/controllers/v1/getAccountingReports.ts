import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where, Sequelize } from 'sequelize';
import {
  monthNumberToName,
  monthNameToNumber,
} from '../../utils/monthConversion';
import { toTitleCase } from '../../utils/toTitleCase';
export const getAccountingReports = async (req: Request, res: Response) => {
  try {
    let { orgId, yearId, monthId } = req.query;

    console.log('query = ', req.query)
    if (!orgId || !yearId || !monthId) {
      return res.status(400).json({
        success: false,
        msg: 'orgId, yearId and monthId are mandatory fields',
      });
    }

    const finalAccounts = await models.FinalAccs.findAll({
      where: {
        OrgId: Number(orgId),
        YearId: Number(yearId),
        MonthId: Number(monthId),
      },
      order: [['id', 'DESC']],
      limit: 1,
    });

    return res.status(200).json({
      success: true,
      data: finalAccounts ? finalAccounts[0] : null,
      metaData: req?.meta ?? null,
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
