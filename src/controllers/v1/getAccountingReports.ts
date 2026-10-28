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

    // const monthNumber = monthNameToNumber(month);

    // const month = await models.Dropdowns.findOne({
    //   where: {
    //     id: monthId,
    //   },
    // });
    // const year = await models.Dropdowns.findOne({
    //   where: {
    //     id: yearId,
    //   },
    // });

    // const journals = await models.Journals.findAll({
    //   where: {
    //     isActive: true,
    //     OrgId: orgId,
    //     year,
    //     monthNumber: monthNumber,
    //   },
    //   attributes: ['CreditorId', 'DebitorId'],

    //   // attributes: [Sequelize.fn('DISTINCT', Sequelize.col('monthNumber'))],
    //   // order: [['monthNumber', 'ASC']],
    //   // raw: true,
    // });

    // const accountsIds = {};
    // journals?.forEach((obj) => {
    //   accountsIds[`${obj.CreditorId}`] = obj.CreditorId;
    //   accountsIds[`${obj.DebitorId}`] = obj.DebitorId;
    // });

    // const accountsIdsArray = Object.values(accountsIds);

    // const ledgers = [];

    // for (let i = 0; i < accountsIdsArray.length; i++) {
    //   const carriedForward = await models.CarriedForwards.findOne({
    //     where: {
    //       AccountId: accountsIdsArray[i],
    //       monthNumber: monthNumber,
    //       year,
    //     },
    //     // include: {
    //     //   model: models.Ledgers,
    //     // },
    //   });

    //   const account = await models.Accounts.findOne({
    //     where: {
    //       id: accountsIdsArray[i],
    //     },
    //     include: {
    //       model: models.Users,
    //       attributes: ['name', 'middleName', 'surName', 'uid'],
    //     },
    //   });
    //   ledgers.push({
    //     name: account?.User?.name ?? '',
    //     uid: account?.User?.uid ?? '',
    //     // url: carriedForward?.Ledger?.fileUrl ?? '',
    //     // json: carriedForward?.Ledger?.json ?? '',
    //   });
    // }

    // // const monthNumbers = journals ? journals.map(obj => obj.monthNumber) : [];

    // // const reports = monthNumbers ? await Promise.all(monthNumbers.map(async (ele) => {
    // //   const month = monthNumberToName(ele) ? toTitleCase(monthNumberToName(ele)) : "";
    // //   const journals2 = await models.Journals.findAll({
    // //     where: {
    // //       isActive: true,
    // //       monthNumber: ele,
    // //       year,
    // //       OrgId: orgId
    // //     },
    // //     attributes: ['CreditorId', 'DebitorId']
    // //   })

    // //   const accountsIds = {};
    // //   journals2?.forEach(obj => {
    // //     accountsIds[`${obj.CreditorId}`] = obj.CreditorId;
    // //     accountsIds[`${obj.DebitorId}`] = obj.DebitorId;
    // //   })

    // //   const accountsIdsArray = Object.values(accountsIds);

    // //   const ledgers = []

    // //   for (let i = 0; i < accountsIdsArray.length; i++){
    // //     const carriedForward = await models.CarriedForwards.findOne({
    // //       where: {
    // //         AccountId: accountsIdsArray[i],
    // //         monthNumber: ele,
    // //         year
    // //       },
    // //       include: {
    // //         model: models.Ledgers
    // //       }
    // //     });

    // //     const account = await models.Accounts.findOne({
    // //       where: {
    // //         id: accountsIdsArray[i]
    // //       },
    // //       include: {
    // //         model: models.Users,
    // //         attributes: ['name', 'middleName', 'surName', 'uid']
    // //       }
    // //     })
    // //     ledgers.push({
    // //       name: account?.User?.name ?? '',
    // //       uid: account?.User?.uid ?? '',
    // //       url: carriedForward?.Ledger?.fileUrl ?? '',
    // //       json: carriedForward?.Ledger?.json ?? '',
    // //     })
    // //   }
    // //   // console.log(month)
    // //   // console.log(ledgers)
    // //   return {
    // //     month: month,
    // //     year: year,
    // //     ledgers: ledgers
    // //   }
    // // })) : [];

    const finalAccounts = await models.FinalAccs.findAll({
      where: {
        orgId: Number(orgId),
        yearId: Number(yearId),
        monthId: Number(monthId),
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
