import { Request, Response } from 'express';
import models from '../../models/index';
import { Op } from 'sequelize';
import momentz from 'moment-timezone';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const postJournalEntry = async (req: Request, res: Response) => {
  try {
    const {
      orgId,
      date,
      particulars,
      DebtorId,
      CreditorId,
      amount,
      isAdjustment,
    } = req.body;

    const monthName = momentz(date).format('MMMM');
    const yearName = momentz(date).year();

    const month = await models.Months.findOne({
      where: {
        name: {
          [Op.iLike]: monthName,
        },
        type: 'months',
      },
    });
    const year = await models.Years.findOne({
      where: {
        name: Number(yearName),
      },
    });

    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }
    const { id: userId } = req.user;

    if (DebtorId == CreditorId) {
      return res
        .status(400)
        .json({ success: false, msg: "Dr. and Cr. accounts can't be same" });
    }

    if (month?.id == null || year?.id == null) {
      return res.status(400).json({
        success: false,
        msg: 'Could not resolve month or year for this date',
      });
    }

    await models.Journals.create({
      OrgId: orgId,
      date,
      particulars,
      DebtorId,
      CreditorId,
      amount,
      BkId: userId,
      MonthId: month.id,
      YearId: year.id,
      isAdjustment,
    });

    return res.status(200).json({
      success: true,
      msg: 'Journal entry posted successfully!',
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
