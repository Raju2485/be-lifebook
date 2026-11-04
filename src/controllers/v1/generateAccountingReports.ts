import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where, Sequelize } from 'sequelize';
import {
  monthNumberToName,
  monthNameToNumber,
} from '../../utils/monthConversion';
import { toTitleCase } from '../../utils/toTitleCase';
import momentz from 'moment-timezone';
import { Journals } from '../../models/journals';
import { getPreviousMonthAndYear } from '../../utils/getPreviousMonthAndYear.ts';
import { getPreviouslyAvailableCfMonthAndYear } from '../../utils/getPreviouslyAvailableCfMonthAndYear.ts';
export const generateAccountingReports = async (
  req: Request,
  res: Response
) => {
  try {
    let { orgId, monthId, yearId } = req.query;
    if (!orgId || !monthId || !yearId) {
      return res.status(400).json({
        success: false,
        msg: 'orgId, monthId and yearId are mandatory fields',
      });
    }

    const month = await models.Months.findOne({
      where: {
        id: monthId,
      },
    });
    const year = await models.Years.findOne({
      where: {
        id: yearId,
      },
    });
    // console.log('month =', month?.toJSON());
    // console.log('year =', year);

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        msg: 'month / year not found for the given monthId / yearId',
      });
    }

    // const monthNumber = monthNameToNumber(month);

    //#region Fetch all account Ids from journals
    const journals = await models.Journals.findAll({
      where: {
        isActive: true,
        MonthId: monthId,
        YearId: yearId,
        // monthNumber: { [Op.between]: [month.fromMonthNum, month.toMonthNum] },
        // year: Number(year.name),
        OrgId: orgId,
      },
      attributes: [
        'CreditorId',
        'DebtorId',
        'particulars',
        'amount',
        'date',
        'isAdjustment',
      ],
      include: [
        {
          model: models.Accounts,
          as: 'Debtor',
          include: {
            model: models.Users,
          },
        },
        {
          model: models.Accounts,
          as: 'Creditor',
          include: {
            model: models.Users,
          },
        },
      ],
      order: [['date', 'ASC']],
    });

    const finalAccounts = {
      journals: {
        heading: `Journals - ${month.name} ${year.name}`,
        entries: [],
      },
      ledgers: [],
      trialBalanceUnadjusted: {
        heading: `Trial Balance Unadjusted - ${month.name} ${year.name}`,
        entries: [],
      },
      trialBalanceAdjusted: {
        heading: `Trial Balance Adjusted - ${month.name} ${year.name}`,
        entries: [],
      },
      tradingAccount : {
        heading: `Trading Account - ${month} ${year}`,
        entries: [],
      },
      pAndLAccount: {
        heading: `P&L Account - ${month.name} ${year.name}`,
        entries: [],
      },
      balanceSheet: {
        heading: `Balance Sheet - ${month.name} ${year.name}`,
        entries: [],
      },
    };

    let accounts = [];
    const accountsIds = {};
    journals?.forEach((obj) => {
      accountsIds[`${obj.CreditorId}`] = obj.CreditorId;
      accountsIds[`${obj.DebtorId}`] = obj.DebtorId;

      const isCreditorFound = accounts.find(
        (account) => account.id === obj.CreditorId
      );
      if (!isCreditorFound) {
        accounts.push({
          id: obj.CreditorId,
          name: obj.Creditor?.User?.name ?? '',
          uid: obj.Creditor?.User?.uid ?? '',
        });
      }
      const isDebtorFound = accounts.find(
        (account) => account.id === obj.DebtorId
      );
      if (!isDebtorFound) {
        accounts.push({
          id: obj.DebtorId,
          name: obj.Debtor?.User?.name ?? '',
          uid: obj.Debtor?.User?.uid ?? '',
        });
      }
      // collecting journals data
      finalAccounts.journals.entries.push({
        date: momentz(obj.date).format('MMM D'),
        particulars: obj.particulars,
        amount: Number(obj.amount),
        debtor: obj.Debtor?.User?.name ?? '',
        creditor: obj.Creditor?.User?.name ?? '',
        isAdjustment: obj.isAdjustment ?? false,
      });
    });

    //#endregion
    const accountsIdsArray = Object.values(accountsIds);
    
    if (month.type == 'months') {

      const { previousCfYearId, previousCfMonthId } = await getPreviouslyAvailableCfMonthAndYear({
        orgId: Number(orgId),
        year,
        month,
      });
console.log('previousCfYearId =', previousCfYearId);
      console.log('previousCfMonthId =', previousCfMonthId);
      
      if (previousCfYearId && previousCfMonthId) {
        const carriedForwards = await models.CarriedForwards.findAll({
          where: {
            [Op.and]: [
              { AccountId: { [Op.notIn]: accountsIdsArray } },
              { YearId: previousCfYearId },
              { MonthId: previousCfMonthId },
            ],
          },
          attributes: ['AccountId', 'creditAmount', 'debitAmount'],
          include: [
            {
              model: models.Accounts,
              as: 'Account',
              where: {
                OrgId: orgId,
                isClosed: false,
              },
              include: {
                model: models.Users,
              },
            },
          ],
          raw: true,
        });
        // console.log('carriedForwards =', carriedForwards);
        carriedForwards.forEach((obj) => {
          const isAccountFound = accounts.find(
            (account) => account.id === obj.AccountId
          );
          if (!isAccountFound) {
            accounts.push({
              id: obj.AccountId,
              name: obj.Account?.User?.name ?? '',
              uid: obj.Account?.User?.uid ?? '',
            });
          }
        });
      }
    }
    //#endregion
    accounts = accounts?.sort((a, b) => a.name.localeCompare(b.name)) || [];

    // console.log('accounts =', accounts);
    //#region Run loop on account ids and prepare and save ledgers in json format - create Carried Forwards if not available else update.
    for (let i = 0; i < accounts.length; i++) {
      const accountJournals = journals.filter(
        (obj) =>
          obj.DebtorId == accounts[i].id || obj.CreditorId == accounts[i].id
      );
      const ledgerUserId = accounts[i].id;

      // const account = await models.Accounts.findOne({
      //   where: {
      //     id: accounts[i].id,
      //   },
      //   include: [{ model: models.Users }],
      // });

      const ledger = {
        name: `${accounts[i]?.name} (${accounts[i].uid})`,
        heading: accounts[i]?.name
          ? `${accounts[i].name} (${accounts[i].uid}) Account - ${month.name} ${year.name}`
          : `${month.name} ${year.name}`,
        entries: [],
      };
      // Collecting last month carried forward
      const { previousMonthNum, previousYear } = await getPreviousMonthAndYear({
        month,
        year,
      });
      // console.log(
      //   'previousMonthNum',
      //   previousMonthNum,
      //   'previousYear',
      //   previousYear
      // );
      // const previousMonthNum =
      //   month.toMonthNum == 1 ? 12 : month.toMonthNum - 1;
      // const previousYear =
      //   month.toMonthNum == 1 ? Number(year.name) - 1 : Number(year.name);

      const carriedForward = await models.CarriedForwards.findOne({
        where: {
          AccountId: accounts[i].id,
          monthNumber: previousMonthNum,
          year: previousYear,
        },
      });

      const carriedForwardDebitAmount = carriedForward?.debitAmount ?? 0;
      const carriedForwardCreditAmount = carriedForward?.creditAmount ?? 0;

      ledger.entries.push({
        date: momentz(
          `${year.name}-${month.fromMonthNum < 10 ? `0${month.fromMonthNum}` : month.fromMonthNum}-01`
        ).format('MMM D'),
        particulars: '',
        accountName: 'Balance b/f',
        debitAmount: carriedForwardCreditAmount
          ? Number(carriedForwardCreditAmount)
          : 0,
        creditAmount: carriedForwardDebitAmount
          ? Number(carriedForwardDebitAmount)
          : 0,
        isAdjustment: false,
      });

      // running loop on accountJournals and collecting records
      for (let j = 0; j < accountJournals.length; j++) {      
          ledger.entries.push({
            date: momentz(accountJournals[j].date).format('MMM D'),
            particulars: accountJournals[j].particulars,
            accountName:
              ledgerUserId == accountJournals[j]?.DebtorId
                ? (accountJournals[j]?.Creditor?.User?.name ?? '')
                : (accountJournals[j]?.Debtor?.User?.name ?? ''),
            debitAmount:
              accountJournals[j]?.DebtorId == ledgerUserId
                ? Number(accountJournals[j].amount)
                : 0,
            creditAmount:
              accountJournals[j]?.CreditorId == ledgerUserId
                ? Number(accountJournals[j].amount)
                : 0,
            isAdjustment: accountJournals[j]?.isAdjustment ?? false,
            // debtor: accountJournals[j]?.Debtor?.User?.name ?? '',
            // creditor: accountJournals[j]?.Creditor?.User?.name ?? '',
          });
            if (accountJournals[j]?.isAdjustment) {
              console.log('accountName = ', ledger.entries[ledger.entries.length - 1]);
            }
      }
      // Calculating the carried forward
      const totalsUnadjusted = {
        debit: 0,
        credit: 0,
      };

      const totalsAdjusted = {
        debit: 0,
        credit: 0,
      };

      ledger.entries.forEach((obj) => {
        if (!obj.isAdjustment) {
          obj.creditAmount
            ? (totalsUnadjusted.credit += Number(obj.creditAmount))
            : '';
          obj.debitAmount
            ? (totalsUnadjusted.debit += Number(obj.debitAmount))
            : '';
        }

        obj.creditAmount
          ? (totalsAdjusted.credit += Number(obj.creditAmount))
          : '';
        obj.debitAmount
          ? (totalsAdjusted.debit += Number(obj.debitAmount))
          : '';
      });

      const debitBalanceUnadjusted =
        totalsUnadjusted.debit > totalsUnadjusted.credit
          ? totalsUnadjusted.debit - totalsUnadjusted.credit
          : 0;
      const creditBalanceUnadjusted =
        totalsUnadjusted.credit > totalsUnadjusted.debit
          ? totalsUnadjusted.credit - totalsUnadjusted.debit
          : 0;

      const debitBalanceAdjusted =
        totalsAdjusted.debit > totalsAdjusted.credit
          ? totalsAdjusted.debit - totalsAdjusted.credit
          : 0;
      const creditBalanceAdjusted =
        totalsAdjusted.credit > totalsAdjusted.debit
          ? totalsAdjusted.credit - totalsAdjusted.debit
          : 0;

      // Collecting data for trial balance

      const trialBalanceAccountUnadjusted = {
        accountName: accounts[i]?.name ?? '',
        debitBalance: debitBalanceUnadjusted ?? 0,
        creditBalance: creditBalanceUnadjusted ?? 0,
      };
      // console.log('trialBalanceAccount =', trialBalanceAccount);
      if ((debitBalanceUnadjusted + creditBalanceUnadjusted) > 0) {
        finalAccounts.trialBalanceUnadjusted.entries.push(
          trialBalanceAccountUnadjusted
        );
      }

      const trialBalanceAccountAdjusted = {
        accountName: accounts[i]?.name ?? '',
        debitBalance: debitBalanceAdjusted ?? 0,
        creditBalance: creditBalanceAdjusted ?? 0,
        isAdjustment: accounts[i]?.isAdjustment ? true : false,
      };
      finalAccounts.trialBalanceAdjusted.entries.push(
        trialBalanceAccountAdjusted
      );

      if (totalsAdjusted.credit != totalsAdjusted.debit) {
        ledger.entries.push({
          date: '',
          particulars: '',
          accountName: 'Balance c/f',
          debitAmount: creditBalanceAdjusted ?? 0,
          creditAmount: debitBalanceAdjusted ?? 0,
          isAdjustment: false,
        });
      }

      // ledger.entries.push({
      //   date: '',
      //   particulars: '',
      //   accountName: 'Total',
      //   debitAmount: creditBalance
      //     ? totals.debit + creditBalance
      //     : totals.debit,
      //   creditAmount: debitBalance
      //     ? totals.credit + debitBalance
      //     : totals.credit,
      // });
      finalAccounts.ledgers.push(ledger);

      // Creating or updating carried forward
      let isCfExists = await models.CarriedForwards.findOne({
        where: {
          AccountId: accounts[i].id,
          MonthId: monthId,
          YearId: yearId,
        },
      });
      if (isCfExists) {
        await isCfExists.update({
          debitAmount: debitBalanceAdjusted ? debitBalanceAdjusted : 0,
          creditAmount: creditBalanceAdjusted ? creditBalanceAdjusted : 0,
        });
      } else {
        isCfExists = await models.CarriedForwards.create({
          AccountId: accounts[i].id,
          debitAmount: debitBalanceAdjusted ? debitBalanceAdjusted : 0,
          creditAmount: creditBalanceAdjusted ? creditBalanceAdjusted : 0,
          YearId: Number(yearId),
          MonthId: Number(monthId),
          OrgId: Number(orgId),
        });
      }
    }
    // caculating totals of trail balance
    // calculating totals
    finalAccounts.trialBalanceUnadjusted.entries.push({
      accountName: 'Total',
      debitBalance: finalAccounts.trialBalanceUnadjusted.entries.reduce(
        (sum, entry) => {
          // Convert empty string to 0, otherwise use the number
          const debit = Number(entry.debitBalance) || 0;
          return sum + debit;
        },
        0
      ),
      creditBalance: finalAccounts.trialBalanceUnadjusted.entries.reduce(
        (sum, entry) => {
          // Convert empty string to 0, otherwise use the number
          const credit = Number(entry.creditBalance) || 0;
          return sum + credit;
        },
        0
      ),
    });

    finalAccounts.trialBalanceAdjusted.entries.push({
      accountName: 'Total',
      debitBalance: finalAccounts.trialBalanceAdjusted.entries.reduce(
        (sum, entry) => {
          // Convert empty string to 0, otherwise use the number
          const debit = Number(entry.debitBalance) || 0;
          return sum + debit;
        },
        0
      ),
      creditBalance: finalAccounts.trialBalanceAdjusted.entries.reduce(
        (sum, entry) => {
          // Convert empty string to 0, otherwise use the number
          const credit = Number(entry.creditBalance) || 0;
          return sum + credit;
        },
        0
      ),
    });
    //#endregion
    //#region Generating adjustment ledgers

    //#endregion
    //#region Generating adjusted trial balance sheet

    //#endregion
    //#region Generating trading account(Prepared in goods based business only)

    //#endregion
    //#region Generating P&L Account Statement

    //#endregion
    //#region Generating Balance Sheet

    //#endregion
    //#region Generating Cash Flow Statement

    //#endregion
    //#region Generate one PDF file with all reports 

    //#endregion

    const isFinalAccountsExists = await models.FinalAccs.findAll({
      where: {
        OrgId: Number(orgId),
        YearId: Number(yearId),
        MonthId: Number(monthId),
      },
      order: [['id', 'DESC']],
      limit: 1,
    });
    if (isFinalAccountsExists?.length > 0) {
      await isFinalAccountsExists[0].update({
        isLatest: false,
      });
    }

    await models.FinalAccs.create({
      OrgId: Number(orgId),
      YearId: Number(yearId),
      MonthId: Number(monthId),
      jsonData: finalAccounts,
      sequence:
        isFinalAccountsExists?.length > 0
          ? isFinalAccountsExists[0].sequence + 1
          : 1,
    });
    return res.status(200).json({
      success: true,
      data: finalAccounts,
      msg: 'Accounting reports generated successfully!',
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
