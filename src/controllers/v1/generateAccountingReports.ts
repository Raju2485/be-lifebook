import { Request, Response } from 'express';
import models from '../../models/index';
import { Op } from 'sequelize';
import momentz from 'moment-timezone';
import { getPreviouslyAvailableCfMonthAndYear } from '../../utils/getPreviouslyAvailableCfMonthAndYear';
import { getErrorMessage } from '../../utils/getErrorMessage';

interface ReportAccount {
  id: number;
  name: string;
  uid: string;
  isAdjustment?: boolean;
}

interface JournalReportEntry {
  date: string;
  particulars: string;
  amount: number;
  debtor: string;
  creditor: string;
  isAdjustment: boolean;
}

interface LedgerReportEntry {
  date: string;
  particulars: string;
  accountName: string;
  amount: number;
  isAdjustment: boolean;
}

interface LedgerReport {
  debitSide: LedgerReportEntry[];
  creditSide: LedgerReportEntry[];
  name: string;
  heading: string;
}

interface TrialBalanceEntry {
  accountName: string;
  debitBalance: number;
  creditBalance: number;
  isAdjustment?: boolean;
}

interface ReportSection<TEntry> {
  heading: string;
  entries: TEntry[];
}

interface FinalAccountsReport {
  journals: ReportSection<JournalReportEntry>;
  ledgers: LedgerReport[];
  trialBalanceUnadjusted: ReportSection<TrialBalanceEntry>;
  trialBalanceAdjusted: ReportSection<TrialBalanceEntry>;
  tradingAccount: ReportSection<Record<string, never>>;
  pAndLAccount: ReportSection<Record<string, never>>;
  balanceSheet: ReportSection<Record<string, never>>;
}

export const generateAccountingReports = async (
  req: Request,
  res: Response
) => {
  try {
    const { orgId, monthId, yearId } = req.query;
    if (!orgId || !monthId || !yearId) {
      return res.status(400).json({
        success: false,
        msg: 'orgId, monthId and yearId are mandatory fields',
      });
    }

    const orgIdNum = Number(orgId);
    const monthIdNum = Number(monthId);
    const yearIdNum = Number(yearId);

    const month = await models.Months.findOne({
      where: {
        id: monthIdNum,
      },
    });
    const year = await models.Years.findOne({
      where: {
        id: yearIdNum,
      },
    });

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        msg: 'month / year not found for the given monthId / yearId',
      });
    }

    //#region Fetch all account Ids from journals
    const journals = await models.Journals.findAll({
      where: {
        isActive: true,
        MonthsM_Id: monthIdNum,
        YearsM_Id: yearIdNum,
        OrgId: orgIdNum,
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
          include: [
            {
              model: models.Users,
            },
          ],
        },
        {
          model: models.Accounts,
          as: 'Creditor',
          include: [
            {
              model: models.Users,
            },
          ],
        },
      ],
      order: [['date', 'ASC']],
    });

    const finalAccounts: FinalAccountsReport = {
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
      tradingAccount: {
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

    let accounts: ReportAccount[] = [];
    const accountsIds: Record<string, number> = {};
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
          uid: String(obj.Creditor?.User?.uid ?? ''),
        });
      }
      const isDebtorFound = accounts.find(
        (account) => account.id === obj.DebtorId
      );
      if (!isDebtorFound) {
        accounts.push({
          id: obj.DebtorId,
          name: obj.Debtor?.User?.name ?? '',
          uid: String(obj.Debtor?.User?.uid ?? ''),
        });
      }
      // collecting journals data
      finalAccounts.journals.entries.push({
        date: momentz(obj.date).format('MMM D'),
        particulars: obj.particulars,
        amount: Number(obj.amount),
        debtor: obj.Debtor?.User?.name ?? '',
        creditor: obj.Creditor?.User?.name ?? '',
        isAdjustment: Boolean(obj.isAdjustment ?? false),
      });
    });

    //#endregion
    const accountsIdsArray = Object.values(accountsIds);

    const { previousCfYearId, previousCfMonthId } =
      await getPreviouslyAvailableCfMonthAndYear({
        orgId: orgIdNum,
        year,
        month,
      });

    if (month.type == 'months') {
      if (previousCfYearId && previousCfMonthId) {
        const carriedForwards = await models.CarriedForwards.findAll({
          where: {
            AccountId: { [Op.notIn]: accountsIdsArray },
            YearsM_Id: previousCfYearId,
            MonthsM_Id: previousCfMonthId,
          },
          attributes: ['AccountId', 'creditAmount', 'debitAmount'],
          include: [
            {
              model: models.Accounts,
              as: 'Account',
              where: {
                OrgId: orgIdNum,
                isClosed: false,
              },
              include: [
                {
                  model: models.Users,
                },
              ],
            },
          ],
          // raw: true,
        });
        carriedForwards.forEach((obj) => {
          console.log('obj =', obj);
          accounts.push({
            id: obj.AccountId,
            name: obj.Account?.User?.name ?? '',
            uid: String(obj.Account?.User?.uid ?? ''),
          });
          // }
        });
      }
    }
    //#endregion
    accounts = accounts?.sort((a, b) => a.name.localeCompare(b.name)) || [];

    //#region Run loop on account ids and prepare and save ledgers in json format - create Carried Forwards if not available else update.
    for (let i = 0; i < accounts.length; i++) {
      const accountJournals = journals.filter(
        (obj) =>
          obj.DebtorId == accounts[i].id || obj.CreditorId == accounts[i].id
      );
      const ledgerUserId = accounts[i].id;

      const ledger: LedgerReport = {
        name: `${accounts[i]?.name} (${accounts[i].uid})`,
        heading: accounts[i]?.name
          ? `${accounts[i].name} (${accounts[i].uid}) Account - ${month.name} ${year.name}`
          : `${month.name} ${year.name}`,
        debitSide: [],
        creditSide: [],
      };
      if (previousCfYearId && previousCfMonthId) {
        const carriedForward = await models.CarriedForwards.findOne({
          where: {
            AccountId: accounts[i].id,
            MonthsM_Id: previousCfMonthId,
            YearsM_Id: previousCfYearId,
          },
        });
        console.log('carriedForward =', carriedForward?.dataValues);

        const carriedForwardDebitAmount = Number(
          carriedForward?.debitAmount ?? 0
        );
        const carriedForwardCreditAmount = Number(
          carriedForward?.creditAmount ?? 0
        );

        if (carriedForwardDebitAmount + carriedForwardCreditAmount > 0) {
          console.log('carriedForwardDebitAmount =', carriedForwardDebitAmount);
          console.log(
            'carriedForwardCreditAmount =',
            carriedForwardCreditAmount
          );
          ledger.debitSide.push({
            date: momentz(
              `${year.name}-${month.fromMonthNum < 10 ? `0${month.fromMonthNum}` : month.fromMonthNum}-01`
            ).format('MMM D'),
            particulars: '',
            accountName: 'Balance b/f',
            amount: carriedForwardCreditAmount
              ? Number(carriedForwardCreditAmount)
              : 0,
            isAdjustment: false,
          });
        }
      }

      // running loop on accountJournals and collecting records
      for (let j = 0; j < accountJournals.length; j++) {
        if (accountJournals[j]?.CreditorId == ledgerUserId) {
          ledger.debitSide.push({
            date: momentz(accountJournals[j].date).format('MMM D'),
            particulars: accountJournals[j].particulars,
            accountName: accountJournals[j]?.Debtor?.User?.name ?? '',
            amount: Number(accountJournals[j].amount),
            isAdjustment: Boolean(accountJournals[j]?.isAdjustment ?? false),
          });
          // if (accountJournals[j]?.isAdjustment) {
          //   console.log(
          //     'accountName = ',
          //     ledger.entries[ledger.entries.length - 1]
          //   );
          // }
        } else {
          ledger.creditSide.push({
            date: momentz(accountJournals[j].date).format('MMM D'),
            particulars: accountJournals[j].particulars,
            accountName: accountJournals[j]?.Creditor?.User?.name ?? '',
            amount: Number(accountJournals[j].amount),
            isAdjustment: Boolean(accountJournals[j]?.isAdjustment ?? false),
          });
        }
      }
      // Calculating the carried forward
      const totalsUnadjusted = {
        debit: ledger.debitSide.reduce((sum, obj) => sum + obj.amount, 0),
        credit: ledger.creditSide.reduce((sum, obj) => sum + obj.amount, 0),
      };

      const totalsAdjustments = {
        debit: ledger.debitSide
          .filter((obj) => obj.isAdjustment)
          .reduce((sum, obj) => sum + obj.amount, 0),
        credit: ledger.creditSide
          .filter((obj) => obj.isAdjustment)
          .reduce((sum, obj) => sum + obj.amount, 0),
      };

      const totalsAdjusted = {
        debit: totalsUnadjusted.debit - totalsAdjustments.debit,
        credit: totalsUnadjusted.credit - totalsAdjustments.credit,
      };

      // ledger.entries.forEach((obj) => {
      //   if (!obj.isAdjustment) {
      //     if (obj.creditAmount) {
      //       totalsUnadjusted.credit += Number(obj.creditAmount);
      //     }
      //     if (obj.debitAmount) {
      //       totalsUnadjusted.debit += Number(obj.debitAmount);
      //     }
      //   }

      //   if (obj.creditAmount) {
      //     totalsAdjusted.credit += Number(obj.creditAmount);
      //   }
      //   if (obj.debitAmount) {
      //     totalsAdjusted.debit += Number(obj.debitAmount);
      //   }
      // });

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

      if (debitBalanceUnadjusted + creditBalanceUnadjusted > 0) {
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
        ledger.debitSide.push({
          date: '',
          particulars: '',
          accountName: 'Balance c/f',
          amount: creditBalanceAdjusted ?? 0,
          isAdjustment: false,
        });
      }

      finalAccounts.ledgers.push(ledger);

      // Creating or updating carried forward
      let isCfExists = await models.CarriedForwards.findOne({
        where: {
          AccountId: accounts[i].id,
          MonthsM_Id: monthIdNum,
          YearsM_Id: yearIdNum,
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
          YearsM_Id: yearIdNum,
          MonthsM_Id: monthIdNum,
          OrgId: orgIdNum,
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
        OrgId: orgIdNum,
        YearsM_Id: yearIdNum,
        MonthsM_Id: monthIdNum,
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
      OrgId: orgIdNum,
      YearsM_Id: yearIdNum,
      MonthsM_Id: monthIdNum,
      isLatest: true,
      isActive: true,
      newChanges: false,
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
      error: getErrorMessage(err),
    });
  }
};
