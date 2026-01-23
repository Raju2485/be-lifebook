import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where, Sequelize } from 'sequelize'
import { monthNumberToName, monthNameToNumber } from '../../utils/monthConversion';
import { toTitleCase } from '../../utils/toTitleCase';
import momentz from 'moment-timezone'
import { Journals } from '../../models/journals';
export const generateAccountingReports = async (req: Request, res: Response) => {
  try {
    let { orgId, month, year } = req.query;
    if (!orgId || !month || !year) {
      return res.status(400).json({
        success: false,
        msg: 'orgId, month and year are mandatory fields'
      })
    }

    const monthNumber = monthNameToNumber(month)

    //#region Fetch all account Ids from journals
    const journals = await models.Journals.findAll({
      where: {
        isActive: true,
        monthNumber,
        year,
        OrgId: orgId,
      },
      attributes: ['CreditorId', 'DebitorId', 'particulars', 'amount', 'date'],
      include: [{
        model: models.Accounts,
        as: 'Debitor',
        include: {
          model: models.Users,
        }
      },
      {
        model: models.Accounts,
        as: 'Creditor',
        include: {
          model: models.Users,
        }
      },
      ],
      order: [['date', 'ASC']]
    });


    const accountsIds = {};
    journals?.forEach(obj => {
      accountsIds[`${obj.CreditorId}`] = obj.CreditorId;
      accountsIds[`${obj.DebitorId}`] = obj.DebitorId;
    })

    const accountsIdsArray = Object.values(accountsIds);
    //#endregion

    //#region Run loop on account ids and prepare and save ledgers in json format - create Carried Forwards if not available else update.
    const ledgers = []
    const trialBalance = { heading: `Trial Balance - ${month} ${year}`, entries: [] }
    for (let i = 0; i < accountsIdsArray.length; i++){
      const accountJournals = journals.filter(obj => obj.DebitorId == accountsIdsArray[i] || obj.CreditorId == accountsIdsArray[i]);
      
      const account = await models.Accounts.findOne({
        where: {
          id: accountsIdsArray[i]
        },
        include: [{ model: models.Users }]
      });

      const ledger = {
        heading: account?.User?.name ? `${account.User.name} Account - ${month} ${year}` : `${month} ${year}`,
        entries: []
      };
      // Collecting last month carried forward
      const carriedForward = await models.CarriedForwards.findOne({
        where: {
          AccountId: accountsIdsArray[i],
          monthNumber: monthNumber -1,
          year
        }
      });
      const carriedForwardDebitAmount = carriedForward?.debitAmount ?? "";
      const carriedForwardCreditAmount = carriedForward?.creditAmount ?? "";

      ledger.entries.push({
        date: momentz(`${year}-${monthNumber < 10 ? `0${monthNumber}` : monthNumber}-01`).format('MMM D'),
        particulars: 'Balance b/f',
        debitAmount: carriedForwardCreditAmount ? Number(carriedForwardCreditAmount) : carriedForwardCreditAmount,
        creditAmount: carriedForwardDebitAmount ? Number(carriedForwardDebitAmount) : carriedForwardDebitAmount,
      })

      // running loop on accountJournals and collecting records
      for (let j = 0; j < accountJournals.length; j++){

        ledger.entries.push({          
          date: momentz(accountJournals[j].date).format("MMM D"),
          particulars: accountJournals[j].particulars,
          debitAmount: accountJournals[j]?.DebitorId == accountsIdsArray[i] ? Number(accountJournals[j].amount) : "",
          creditAmount: accountJournals[j]?.CreditorId == accountsIdsArray[i] ? Number(accountJournals[j].amount) : "",
          debitor: accountJournals[j]?.Debitor?.User?.name ?? '',
          creditor: accountJournals[j]?.Creditor?.User?.name ?? '',
        })
      }
      // Calculating the carried forward
      const totals = {
        debit: 0,
        credit: 0
      }
      ledger.entries.forEach(obj => {
        obj.creditAmount ? totals.credit += Number(obj.creditAmount) : '';
        obj.debitAmount ? totals.debit += Number(obj.debitAmount) : '';
      })

      const debitBalance = totals.debit > totals.credit ? totals.debit - totals.credit : "";
      const creditBalance = totals.credit > totals.debit ? totals.credit - totals.debit : "";

      // Collecting data for trial balance      

      const trialBalanceAccount = {
        accountName: account?.User?.name ?? "",
        debitBalance,
        creditBalance
      };
      trialBalance.entries.push(trialBalanceAccount)
            
      if (totals.credit != totals.debit) {
        ledger.entries.push({
          date: "",
          particulars: 'Balance c/f',
          debitAmount: creditBalance ?? '',
          creditAmount: debitBalance ?? ''
        });
      }
      
      ledger.entries.push({
        date: "",
        particulars: 'Totals',
        debitAmount: creditBalance ? totals.debit + creditBalance : totals.debit,
        creditAmount: debitBalance ? totals.credit + debitBalance : totals.credit
      });
      ledgers.push(ledger);

      // Creating or updating carried forward
      let isCfExists = await models.CarriedForwards.findOne({
        where: {          
        AccountId: accountsIdsArray[i],
        month: {[Op.iLike]: month},
        monthNumber,
        year: Number(year)
        }
      })
      if (isCfExists) {        
        await isCfExists.update({
          debitAmount: debitBalance ? debitBalance : null,
          creditAmount: creditBalance ? creditBalance : null,
        })
      }
      else {        
        isCfExists = await models.CarriedForwards.create({
          AccountId: accountsIdsArray[i],
          debitAmount: debitBalance ? debitBalance : null,
          creditAmount: creditBalance ? creditBalance : null,
          month: toTitleCase(month),
          monthNumber,
          year: Number(year)
        })
      }
      // Creating or updating ledger
      let isLedgerExists = await models.Ledgers.findOne({
        where: {
          CfId: isCfExists.id
        }
      })
      if (isLedgerExists) {
        await isLedgerExists.update({
          json: ledger,
          fileName: "test",
          fileUrl: 'test'
        });
      }
      else {
        await models.Ledgers.create({
          CfId: isCfExists.id,
          json: ledger,
          fileName: "test",
          fileUrl: 'test'
        });
      }
    }
    // caculating totals of trail balance
    // calculating totals      
    trialBalance.entries.push({
      accountName: "Totals",
      debitBalance: trialBalance.entries.reduce((sum, entry) => {
        // Convert empty string to 0, otherwise use the number
        const debit = Number(entry.debitBalance) || 0;
        return sum + debit;
      }, 0),
      creditBalance: trialBalance.entries.reduce((sum, entry) => {
        // Convert empty string to 0, otherwise use the number
        const credit = Number(entry.creditBalance) || 0;
        return sum + credit;
      }, 0)
    })
    //#endregion
    //#region Generating trial balance sheet

    //#endregion


    return res.status(200).json({
      success: true,
      data: {
        month: month,
        ledgers: ledgers
      },
      trialBalance,
      msg: 'Accounting reports generated successfully!'
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
