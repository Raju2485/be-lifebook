import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize'
import { getLimitAndOffset, getNewPagination} from '../../utils/newPagination'
import { isValidDate } from '../../utils/isValidDate'
import { monthNameToNumber } from '../../utils/monthConversion'
import momentz from 'moment-timezone'

export const postJournalEntry = async (req: Request, res: Response) => {
  try {
    const {
      orgId,
      date,
      particulars,
      DebitorId,
      CreditorId,
      amount
    } = req.body;

    const month = momentz(date).format('MMMM');
    const monthNumber = monthNameToNumber(month);
    const year = momentz(date).year();

    const { id: userId } = req.user;

    if (DebitorId == CreditorId) {
      return res.status(400).json({success: false, msg: "Dr. and Cr. accounts can't be same"})
    }


    await models.Journals.create({
      OrgId: orgId,
      date,
      particulars,
      DebitorId,
      CreditorId,
      amount,
      BkId: userId,
      monthNumber,
      year
    })

      return res.status(200).json({
        success: true,
        msg: 'Journal entry posted successfully!',
      })

} 
    catch (err) {
        console.log(err)
      return res.status(400).json({
        success: false,
        msg: 'Something went wrong, we are looking into it',
        error: err.message
      })
    }
}
