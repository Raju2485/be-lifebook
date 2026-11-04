import { Request, Response } from 'express';
import { Op } from 'sequelize';
import fs from 'fs';
import momentz from 'moment-timezone';
import { sequelize } from '../../config/database';
import models from '../../models/index';
import Excel from 'exceljs';
import { monthNameToNumber } from '../../utils/monthConversion';
import { normalizeExcelValues } from '../../utils/normalizeExcelValues';
import { getSystemErrorMessage } from 'util';

export const importJournalsFromExcel = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.user;
    let { orgId } = req.body;
    orgId = parseInt(orgId);

    if (!orgId || !req.file) {
      if (req?.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ success: false, msg: 'orgId and file are mandatory' });
    }

    if (req?.file) {
      const filePath = req.file.path;
      if (req.file.originalname.match(/\.xlsx$/)) {
        var workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet1 = workbook.getWorksheet(1);

        const dateLabel = 'date (d&m&yyyy)';
        const particularsLabel = 'particulars';
        const amountLabel = 'amount';
        const debtorAccountNameLabel = 'debtor account name';
        const debtorAccountEmailLabel = 'debtor account email';
        const creditorAccountNameLabel = 'creditor account name';
        const creditorAccountEmailLabel = 'creditor account email';
        const isAdjustmentLabel = 'is adjustment?(yes/no)';

        const columns = [
          {
            label: dateLabel,
            index: 1,
          },
          {
            label: particularsLabel,
            index: 2,
          },
          {
            label: amountLabel,
            index: 3,
          },
          {
            label: debtorAccountNameLabel,
            index: 4,
          },
          {
            label: debtorAccountEmailLabel,
            index: 5,
          },
          {
            label: creditorAccountNameLabel,
            index: 6,
          },
          {
            label: creditorAccountEmailLabel,
            index: 7,
          },
          {
            label: isAdjustmentLabel,
            index: 8,
          },
        ];

        const dateColumn = columns.find((a) => a.label === dateLabel);
        const particularsColumn = columns.find(
          (a) => a.label === particularsLabel
        );
        const amountColumn = columns.find((a) => a.label === amountLabel);
        const debtorAccountNameColumn = columns.find(
          (a) => a.label === debtorAccountNameLabel
        );
        const debtorAccountEmailColumn = columns.find(
          (a) => a.label === debtorAccountEmailLabel
        );

        const creditorAccountNameColumn = columns.find(
          (a) => a.label === creditorAccountNameLabel
        );
        const creditorAccountEmailColumn = columns.find(
          (a) => a.label === creditorAccountEmailLabel
        );
        const isAdjustmentColumn = columns.find(
          (a) => a.label === isAdjustmentLabel
        );
        const headerRow = sheet1.getRow(1).values;

        // #region Validating columns names
        const incorrectColumnNames = [];
        columns?.forEach((obj) => {
          let header = headerRow[obj.index];
          if (!header) {
            fs.unlinkSync(filePath);
            return res
              .status(400)
              .json({ success: false, msg: 'Incorrect template format' });
          }
          header = header.replace(/\s+/g, '').toLowerCase();
          const label = obj.label.replace(/\s+/g, '').toLowerCase();
          if (header != label) {
            incorrectColumnNames.push(headerRow[obj.index]);
          }
        });
        if (incorrectColumnNames.length > 0) {
          fs.unlinkSync(filePath);
          console.log('incorrectColumnNames = ', incorrectColumnNames);
          return res.status(400).json({
            success: false,
            msg: `${incorrectColumnNames} are incorrect column names`,
          });
        }
        // #endregion

        // #region Validating dates
        let dateColumnValues = sheet1.getColumn(dateColumn.index).values; // column number or key

        const isValidDateString = (value) => {
          const year = value.split('&')[2];
          const month = value.split('&')[1];
          const date = value.split('&')[0];
          const dateString = `${year}-${month.length > 1 ? month : `0${month}`}-${date.length > 1 ? date : `0${date}`}`;
          const date2 = new Date(dateString);
          return !isNaN(date2.getTime());
        };

        dateColumnValues = dateColumnValues.slice(2);
        dateColumnValues.forEach((ele) => {
          if (!isValidDateString(ele)) {
            fs.unlinkSync(filePath);

            return res
              .status(400)
              .json({ success: false, msg: `${ele} is not a valid date` });
          }
        });

        if (
          dateColumnValues.indexOf(undefined) > 0 ||
          dateColumnValues.indexOf(null) > 0 ||
          dateColumnValues.indexOf('') > 0
        ) {
          fs.unlinkSync(filePath);

          return res
            .status(400)
            .json({ success: false, msg: 'Date cannot be empty' });
        }
        // #endregion
        // #region Validating amounts
        let amountColumnValues = sheet1?.getColumn(amountColumn?.index)?.values; // column number or key

        const isValidAmount = (value) => {
          value = Number(value);
          return !isNaN(value) && value > 0;
        };
        amountColumnValues = amountColumnValues.slice(2);

        amountColumnValues.forEach((ele) => {
          if (!isValidAmount(ele)) {
            fs.unlinkSync(filePath);

            return res
              .status(400)
              .json({ success: false, msg: `${ele} is not a valid amount` });
          }
        });

        if (
          amountColumnValues.indexOf(undefined) > 0 ||
          amountColumnValues.indexOf(null) > 0 ||
          amountColumnValues.indexOf('') > 0
        ) {
          fs.unlinkSync(filePath);

          return res
            .status(400)
            .json({ success: false, msg: 'Amount cannot be empty' });
        }
        //#endregion

        // #region Validating debtor account names

        const isAccountExists = async (value) => {
          const account = await models.Accounts.findOne({
            include: [
              {
                model: models.Users,
                attributes: ['id', 'name'],
                where: {
                  name: { [Op.iLike]: value },
                },
              },
            ],
            where: {
              OrgId: orgId,
            },
          });
          return !!account;
        };

        // let notFoundAccounts = {};
        let notFoundAccounts = [];

        let debtorAccountNameColumnValues = normalizeExcelValues(
          sheet1?.getColumn(debtorAccountNameColumn?.index)?.values
        ); // column number or key
        debtorAccountNameColumnValues =
          debtorAccountNameColumnValues?.slice(2);

        if (
          debtorAccountNameColumnValues.indexOf(undefined) > 0 ||
          debtorAccountNameColumnValues.indexOf(null) > 0 ||
          debtorAccountNameColumnValues.indexOf('') > 0
        ) {
          fs.unlinkSync(filePath);

          return res.status(400).json({
            success: false,
            msg: 'Debtor account name cannot be empty',
          });
        }

        let debtorAccountEmailColumnValues = normalizeExcelValues(
          sheet1?.getColumn(debtorAccountEmailColumn?.index)?.values
        ); // column number or key
        debtorAccountEmailColumnValues =
          debtorAccountEmailColumnValues?.slice(2);
        
        let errors: string[] = [];
        const isUserExists = async ({
          email,
          name,
        }: {
          email: string;
          name: string;
        }) => {
          let user = null;
          if (email) {
            user = await models.Users.findOne({
              where: {
                email: { [Op.iLike]: email },
              },
            });

            if (user && user.name !== name) {
              errors.push(`${email} exists with name "${user.name}" but wrong name "${name}" is provided`);
            }
            console.log('email user = ', email, name);
          } else {
            user = await models.Users.findOne({
              where: {
                name: {
                  [Op.iLike]: name,
                },
                orgId: orgId,
              },
            });
            console.log('name user = ', user, orgId);
          }
          return !!user;
        };

        for (let i = 0; i < debtorAccountNameColumnValues.length; i++) {
          let debtorAccName = debtorAccountNameColumnValues[i].trim();
          let debtorAccEmail = debtorAccountEmailColumnValues[i]
            ? debtorAccountEmailColumnValues[i]?.trim()
            : null;

          let notFoundAccIndex = notFoundAccounts.findIndex(
            (a) => a.accountName === debtorAccName
          );
          if (notFoundAccIndex === -1) {
            if (!(await isAccountExists(debtorAccName))) {
              const isUserExistsResult = await isUserExists({
                email: debtorAccEmail,
                name: debtorAccName,
              });
              notFoundAccounts.push({
                accountName: debtorAccName,
                email: debtorAccEmail,
                isUserExists: !!isUserExistsResult,
              });
            }
          }
        }
        // );

        let creditorAccountNameColumnValues = normalizeExcelValues(
          sheet1?.getColumn(creditorAccountNameColumn?.index)?.values
        ); // column number or key
        creditorAccountNameColumnValues =
          creditorAccountNameColumnValues?.slice(2);

        let creditorAccountEmailColumnValues = normalizeExcelValues(
          sheet1?.getColumn(creditorAccountEmailColumn?.index)?.values
        ); // column number or key
        creditorAccountEmailColumnValues =
          creditorAccountEmailColumnValues?.slice(2);

        if (
          creditorAccountNameColumnValues.indexOf(undefined) > 0 ||
          creditorAccountNameColumnValues.indexOf(null) > 0 ||
          creditorAccountNameColumnValues.indexOf('') > 0
        ) {
          fs.unlinkSync(filePath);

          return res.status(400).json({
            success: false,
            msg: 'Creditor account name cannot be empty',
          });
        }

        for (let j = 0; j < creditorAccountNameColumnValues.length; j++) {
          let creditorAccName = creditorAccountNameColumnValues[j].trim();
          let creditorAccEmail = creditorAccountEmailColumnValues[j]
            ? creditorAccountEmailColumnValues[j].trim()
            : null;
          let notFoundAccIndex = notFoundAccounts.findIndex(
            (a) => a.accountName === creditorAccName
          );
          if (notFoundAccIndex === -1) {
            if (!(await isAccountExists(creditorAccName))) {
              const isUserExistsResult = await isUserExists({
                name: creditorAccName,
                email: creditorAccEmail,
              });

              notFoundAccounts.push({
                accountName: creditorAccName,
                email: creditorAccEmail,
                isUserExists: !!isUserExistsResult,
              });
            }
          }
        }

        if (errors.length > 0) {
          fs.unlinkSync(filePath);
          return res.status(400).json({
            success: false, 
            msg: errors,
          });
        }
        // notFoundAccounts = Object.values(notFoundAccounts)

        if (notFoundAccounts.length > 0) {
          fs.unlinkSync(filePath);
          return res.status(206).json({
            success: false,
            msg: `Account(s) not found`,
            data: notFoundAccounts,
          });
        }

        //#endregion


        const rows = sheet1.getSheetValues();

        const t = await sequelize.transaction();
        try {
          // Creating records
          for (let i = 2; i < rows.length; i++) {
            let row = rows[i];

            row = row.map((cell) => {
              if (cell && typeof cell === 'object' && cell.richText) {
                // Rich text detected
                plainText = cell.richText.map((rt) => rt.text).join('');
                return plainText;
              } else if (cell && typeof cell === 'object' && cell.text) {
                return cell?.text;
              } else if (cell && typeof cell === 'object' && cell.result) {
                return cell?.result;
              }
              return cell;
            });

            let rawDate = row[dateColumn.index];
            const year = row[dateColumn.index].split('&')[2];
            const month = row[dateColumn.index].split('&')[1];
            const date = row[dateColumn.index].split('&')[0];
            const dateString = `${year}-${month.length > 1 ? month : `0${month}`}-${date.length > 1 ? date : `0${date}`}`;
            const date2 = new Date(dateString);
            let monthNumber = isNaN(parseInt(month))
              ? monthNameToNumber(month)
              : month;
            let particulars = row[particularsColumn.index];
            let amount = row[amountColumn.index];
            let debtorAcc = row[debtorAccountNameColumn.index];
            let debtorAccEmail = row[debtorAccountEmailColumn.index];
            let creditorAcc = row[creditorAccountNameColumn.index];
            let creditorAccEmail = row[creditorAccountEmailColumn.index];
            let isAdjustment = row[isAdjustmentColumn.index];
            // let creditorAccCashOrBank = row[creditorAccountCashOrBankColumn.index];

    const month2 = await models.Months.findOne({
      where: {
        sequence: Number(month),
        type: 'months',
      },
      raw: true
    });
    const year2 = await models.Years.findOne({
      where: {
        name: Number(year),
      },
      raw: true,
    });
            // console.log('monthNumber = ', month)
            // console.log('month =' , month2, 'year = ', year2)

            // // //#region find or create debtor account
            let isDebtorUserExists;
            if (debtorAccEmail) {              
             isDebtorUserExists  = await models.Users.findOne({
               where: {
                 name: {
                   [Op.iLike]: debtorAcc,
                 },
                 email: {
                  [Op.iLike]: debtorAccEmail,
                 },
               },
             });
          } else {
            isDebtorUserExists = await models.Users.findOne({
              where: {
                name: {
                  [Op.iLike]: debtorAcc,
                },
                orgId: orgId,
              },
            });
            }
            

            if (!isDebtorUserExists) {
              await t.rollback();
              fs.unlinkSync(filePath);
              return res.status(404).json({
                success: false,
                msg: `${debtorAcc} not found`,
              });
            }


            let isDebtorAccountExists = await models.Accounts.findOne({
              where: {
                OrgId: orgId,
                UserId: isDebtorUserExists.id,
              },

            });

            // // //#region find or create creditor account
            let isCreditorUserExists;
            if (creditorAccEmail) {
              isCreditorUserExists = await models.Users.findOne({
                where: {
                  name: { [Op.iLike]: creditorAcc },
                  email: { [Op.iLike]: creditorAccEmail },
                },
              });
            } else {
              isCreditorUserExists = await models.Users.findOne({
                where: {
                  name: { [Op.iLike]: creditorAcc },
                  orgId: orgId,
                },
              });
            }

            if (!isCreditorUserExists) {
              await t.rollback();
              fs.unlinkSync(filePath);
              return res.status(404).json({
                success: false,
                msg: `${creditorAcc} not found`,
              });
            }

            let isCreditorAccountExists = await models.Accounts.findOne({
              where: {
                OrgId: orgId,
                UserId: isCreditorUserExists.id,
              },
            });
            
            // //#endregion
            console.log('debtorAcc = ', debtorAcc);
            console.log('DebtorId = ', isDebtorAccountExists?.dataValues?.id);
            console.log('creditorAcc = ', creditorAcc);
console.log('CreditorId = ', isCreditorAccountExists?.dataValues?.id);
            // creating journal
            const isTheJournalExists = await models.Journals.findOne({
              where: {
                OrgId: orgId,
                date: date2,
                particulars,
                DebtorId: isDebtorAccountExists?.dataValues?.id,
                CreditorId: isCreditorAccountExists?.dataValues?.id,
              },
            });
            if(isTheJournalExists){
              await t.rollback();
              fs.unlinkSync(filePath);
              return res.status(400).json({
                success: false,
                msg: `particulars = "${particulars}", Debtor = "${debtorAcc}", Creditor = "${creditorAcc}", date = "${rawDate}" and amount = "${amount}" already exists`,
              });
            }
            await models.Journals.create(
              {
                OrgId: orgId,
                date: date2,
                particulars,
                DebtorId: isDebtorAccountExists?.dataValues?.id,
                CreditorId: isCreditorAccountExists?.dataValues?.id,
                amount,
                BkId: userId,
                MonthId: month2?.id,
                YearId: year2?.id,
                isAdjustment: isAdjustment?.toLowerCase() === 'yes' ? true : false,
              },
              { transaction: t }
            );
          }
          await t.commit();
          fs.unlinkSync(filePath);
          return res.status(200).json({
            success: true,
            msg: 'Journals imported successfully!',
            metaData: req?.meta ?? null,
          });
        } catch (err) {
          await t.rollback();
          throw err;
        }
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          success: false,
          message: 'Please upload a valid .xlsx file',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid .xlsx file',
      });
    }
  } catch (err) {
    console.log(err);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      msg: 'Something went wrong. We are looking into it.',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
