import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where, Sequelize } from 'sequelize'
import { monthNumberToName } from '../../utils/monthConversion';
import { toTitleCase } from '../../utils/toTitleCase'
export const getAccountingReports = async (req: Request, res: Response) => {
  try {
    let { orgId, year } = req.query;
    if (!orgId || !year) {
      return res.status(400).json({
        success: false,
        msg: 'orgId and year are mandatory fields'
      })
    }

    const journals = await models.Journals.findAll({
      where: {
        isActive: true,
        OrgId: orgId,
        year
      },
      attributes: [Sequelize.fn('DISTINCT', Sequelize.col('monthNumber'))],
      order: [['monthNumber', 'ASC']],
      raw: true
    })

    const monthNumbers = journals ? journals.map(obj => obj.monthNumber) : [];

    const reports = monthNumbers ? await Promise.all(monthNumbers.map(async (ele) => {
      const month = monthNumberToName(ele) ? toTitleCase(monthNumberToName(ele)) : "";
      const journals2 = await models.Journals.findAll({
        where: {
          isActive: true,
          monthNumber: ele,
          year,
          OrgId: orgId
        },
        attributes: ['CreditorId', 'DebitorId']
      })

      const accountsIds = {};
      journals2?.forEach(obj => {
        accountsIds[`${obj.CreditorId}`] = obj.CreditorId;
        accountsIds[`${obj.DebitorId}`] = obj.DebitorId;
      })

      const accountsIdsArray = Object.values(accountsIds);

      
      const ledgers = []

      for (let i = 0; i < accountsIdsArray.length; i++){
        const carriedForward = await models.CarriedForwards.findOne({
          where: {
            AccountId: accountsIdsArray[i],
            monthNumber: ele,
            year
          },
          include: {
            model: models.Ledgers
          }
        });

        const account = await models.Accounts.findOne({
          where: {
            id: accountsIdsArray[i]
          },
          include: {
            model: models.Users,
            attributes: ['name', 'middleName', 'surName', 'uid']
          }
        })
        ledgers.push({
          name: account?.User?.name ?? '',
          uid: account?.User?.uid ?? '',
          url: carriedForward?.Ledger?.fileUrl ?? ''
        })
      }
      // console.log(month)
      // console.log(ledgers)
      return {
        month: month,
        ledgers: ledgers
      }
    })) : [];
  
  return res.status(200).json({
    success: true,
    data: reports,
  });
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
