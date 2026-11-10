import { Request, Response } from 'express';
import { Op } from 'sequelize';
import fs from 'fs';
import { sequelize } from '../../config/database';
import models from '../../models/index';
import Excel, { type CellValue, type RowValues } from 'exceljs';
import { normalizeExcelValues } from '../../utils/normalizeExcelValues';

type ColumnDef = { label: string; index: number };

type NotFoundAccount = {
  accountName: string;
  email: string | null;
  isUserExists: boolean;
};

function getIndexedCell(row: RowValues, index: number): CellValue | undefined {
  if (Array.isArray(row)) {
    return row[index];
  }
  return (row as Record<number, CellValue>)[index];
}

function rowValuesAsArray(row: RowValues): CellValue[] {
  if (Array.isArray(row)) {
    return [...row];
  }
  const record = row as Record<string, CellValue>;
  const indices = Object.keys(record)
    .map((k) => Number(k))
    .filter((n) => !Number.isNaN(n));
  const max = indices.length ? Math.max(...indices) : 0;
  const arr: CellValue[] = [];
  for (let i = 0; i <= max; i++) {
    arr[i] = record[String(i)] ?? record[i as unknown as string];
  }
  return arr;
}

function excelCellToScalar(cell: CellValue): CellValue {
  if (cell !== null && typeof cell === 'object') {
    if (
      'richText' in cell &&
      Array.isArray((cell as Excel.CellRichTextValue).richText)
    ) {
      return (cell as Excel.CellRichTextValue).richText
        .map((rt) => rt.text)
        .join('');
    }
    if ('text' in cell && (cell as { text?: string }).text !== undefined) {
      return (cell as { text: string }).text;
    }
    if ('result' in cell) {
      return (cell as { result: CellValue }).result;
    }
  }
  return cell;
}

export const importJournalsFromExcel = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }
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
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet1 = workbook.getWorksheet(1);
        if (!sheet1) {
          fs.unlinkSync(filePath);
          return res
            .status(400)
            .json({ success: false, msg: 'Incorrect template format' });
        }

        const dateLabel = 'date (d&m&yyyy)';
        const particularsLabel = 'particulars';
        const amountLabel = 'amount';
        const debtorAccountNameLabel = 'debtor account name';
        const debtorAccountEmailLabel = 'debtor account email';
        const creditorAccountNameLabel = 'creditor account name';
        const creditorAccountEmailLabel = 'creditor account email';
        const isAdjustmentLabel = 'is adjustment?(yes/no)';

        const columns: ColumnDef[] = [
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

        const dateColumn = columns.find((a) => a.label === dateLabel)!;
        const particularsColumn = columns.find(
          (a) => a.label === particularsLabel
        )!;
        const amountColumn = columns.find((a) => a.label === amountLabel)!;
        const debtorAccountNameColumn = columns.find(
          (a) => a.label === debtorAccountNameLabel
        )!;
        const debtorAccountEmailColumn = columns.find(
          (a) => a.label === debtorAccountEmailLabel
        )!;

        const creditorAccountNameColumn = columns.find(
          (a) => a.label === creditorAccountNameLabel
        )!;
        const creditorAccountEmailColumn = columns.find(
          (a) => a.label === creditorAccountEmailLabel
        )!;
        const isAdjustmentColumn = columns.find(
          (a) => a.label === isAdjustmentLabel
        )!;
        const headerRow = sheet1.getRow(1).values as RowValues;

        // #region Validating columns names
        const incorrectColumnNames: CellValue[] = [];
        columns.forEach((obj) => {
          let header = getIndexedCell(headerRow, obj.index);
          if (!header) {
            fs.unlinkSync(filePath);
            return res
              .status(400)
              .json({ success: false, msg: 'Incorrect template format' });
          }
          header = String(header).replace(/\s+/g, '').toLowerCase();
          const label = obj.label.replace(/\s+/g, '').toLowerCase();
          if (header != label) {
            incorrectColumnNames.push(getIndexedCell(headerRow, obj.index)!);
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

        const isValidDateString = (value: unknown) => {
          const year = String(value).split('&')[2];
          const month = String(value).split('&')[1];
          const date = String(value).split('&')[0];
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
        let amountColumnValues = sheet1.getColumn(amountColumn.index).values; // column number or key

        const isValidAmount = (value: unknown) => {
          const num = Number(value);
          return !isNaN(num) && num > 0;
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

        const isAccountExists = async (value: string) => {
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

        const notFoundAccounts: NotFoundAccount[] = [];

        let debtorAccountNameColumnValues = normalizeExcelValues(
          sheet1.getColumn(debtorAccountNameColumn.index).values
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
          sheet1.getColumn(debtorAccountEmailColumn.index).values
        ); // column number or key
        debtorAccountEmailColumnValues =
          debtorAccountEmailColumnValues?.slice(2);
        
        const errors: string[] = [];
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
          const debtorAccName = debtorAccountNameColumnValues[i].trim();
          const debtorAccEmail = debtorAccountEmailColumnValues[i]
            ? debtorAccountEmailColumnValues[i]?.trim()
            : null;

          const notFoundAccIndex = notFoundAccounts.findIndex(
            (a) => a.accountName === debtorAccName
          );
          if (notFoundAccIndex === -1) {
            if (!(await isAccountExists(debtorAccName))) {
              const isUserExistsResult = await isUserExists({
                email: debtorAccEmail ?? '',
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
          sheet1.getColumn(creditorAccountNameColumn.index).values
        ); // column number or key
        creditorAccountNameColumnValues =
          creditorAccountNameColumnValues?.slice(2);

        let creditorAccountEmailColumnValues = normalizeExcelValues(
          sheet1.getColumn(creditorAccountEmailColumn.index).values
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
          const creditorAccName = creditorAccountNameColumnValues[j].trim();
          const creditorAccEmail = creditorAccountEmailColumnValues[j]
            ? creditorAccountEmailColumnValues[j].trim()
            : null;
          const notFoundAccIndex = notFoundAccounts.findIndex(
            (a) => a.accountName === creditorAccName
          );
          if (notFoundAccIndex === -1) {
            if (!(await isAccountExists(creditorAccName))) {
              const isUserExistsResult = await isUserExists({
                name: creditorAccName,
                email: creditorAccEmail ?? '',
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
            const rawRow = rows[i];
            if (rawRow == null) {
              continue;
            }
            const row = rowValuesAsArray(rawRow).map(excelCellToScalar);

            const dateCell = String(row[dateColumn.index] ?? '');
            const rawDate = dateCell;
            const year = dateCell.split('&')[2];
            const month = dateCell.split('&')[1];
            const date = dateCell.split('&')[0];
            const dateString = `${year}-${month.length > 1 ? month : `0${month}`}-${date.length > 1 ? date : `0${date}`}`;
            const date2 = new Date(dateString);
            const particulars = String(row[particularsColumn.index] ?? '');
            const amount = Number(row[amountColumn.index]);
            const debtorAcc = String(row[debtorAccountNameColumn.index] ?? '');
            const debtorAccEmailRaw = row[debtorAccountEmailColumn.index];
            const debtorAccEmail =
              debtorAccEmailRaw != null && debtorAccEmailRaw !== ''
                ? String(debtorAccEmailRaw)
                : null;
            const creditorAcc = String(
              row[creditorAccountNameColumn.index] ?? ''
            );
            const creditorAccEmailRaw = row[creditorAccountEmailColumn.index];
            const creditorAccEmail =
              creditorAccEmailRaw != null && creditorAccEmailRaw !== ''
                ? String(creditorAccEmailRaw)
                : null;
            const isAdjustment = row[isAdjustmentColumn.index];
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


            const isDebtorAccountExists = await models.Accounts.findOne({
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

            const isCreditorAccountExists = await models.Accounts.findOne({
              where: {
                OrgId: orgId,
                UserId: isCreditorUserExists.id,
              },
            });
            
            // //#endregion
            // creating journal
            const isTheJournalExists = await models.Journals.findOne({
              where: {
                OrgId: orgId,
                date: date2,
                particulars,
                DebtorId: isDebtorAccountExists!.id,
                CreditorId: isCreditorAccountExists!.id,
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
                DebtorId: isDebtorAccountExists!.id,
                CreditorId: isCreditorAccountExists!.id,
                amount,
                BkId: userId,
                MonthId: month2!.id,
                YearId: year2!.id,
                isAdjustment:
                  String(isAdjustment ?? '').toLowerCase() === 'yes'
                    ? true
                    : false,
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
