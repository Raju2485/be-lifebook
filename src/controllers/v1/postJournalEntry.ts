import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { isValidDate } from '../../utils/isValidDate';
import { monthNameToNumber } from '../../utils/monthConversion';
import momentz from 'moment-timezone';

export const postJournalEntry = async (req: Request, res: Response) => {
  try {
    const { orgId, date, particulars, DebitorId, CreditorId, amount, isAdjustment } =
      req.body;

    const monthName = momentz(date).format('MMMM');
    // const monthNumber = monthNameToNumber(month);
    const yearName = momentz(date).year();

    const month = await models.Dropdowns.findOne({
      where: {
        name: {
          [Op.iLike]: monthName,
        },
        type: 'months',
      },
    });
    const year = await models.Dropdowns.findOne({
      where: {
        name: String(yearName),
        type: 'years',
      },
    });

    const { id: userId } = req.user;

    if (DebitorId == CreditorId) {
      return res
        .status(400)
        .json({ success: false, msg: "Dr. and Cr. accounts can't be same" });
    }

    await models.Journals.create({
      OrgId: orgId,
      date,
      particulars,
      DebitorId,
      CreditorId,
      amount,
      BkId: userId,
      monthId: month?.id,
      yearId: year?.id,
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
      error: err.message,
    });
  }
};
