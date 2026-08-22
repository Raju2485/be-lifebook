
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import fs from 'fs';
import momentz from 'moment-timezone';
import { sequelize } from '../../config/database';
import models from '../../models/index';
import Excel from 'exceljs';
import { monthNameToNumber } from '../../utils/monthConversion';

export const importJournalsFromExcel = async (req : Request, res: Response) => {
  try {
    const { id: userId } = req.user;
    let { orgId } = req.body;
    orgId = parseInt(orgId)
      

    if (!orgId || !req.file) {
      if (req?.file) {
        fs.unlinkSync(req.file.path)

      }
      return res
        .status(400)
        .json({ success: false, msg: 'orgId and file and mandatory' });
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
        const debitorAccountNameLabel = 'debitor account name';
        const creditorAccountNameLabel = 'creditor account name';

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
            label: debitorAccountNameLabel,
            index: 4,
          },
          {
            label: creditorAccountNameLabel,
            index: 5,
          }
        ];

        const dateColumn = columns.find((a) => a.label === dateLabel);
        const particularsColumn = columns.find((a) => a.label === particularsLabel);
        const amountColumn = columns.find((a) => a.label === amountLabel);
        const debitorAccountNameColumn = columns.find((a) => a.label === debitorAccountNameLabel);
        const creditorAccountNameColumn = columns.find((a) => a.label === creditorAccountNameLabel); 
        const headerRow = sheet1.getRow(1).values;

        // #region Validating columns names
        const incorrectColumnNames = [];
        columns?.forEach((obj) => {
          let header = headerRow[obj.index]
          if (!header) {
            fs.unlinkSync(filePath)
            return res.status(400).json({success: false, msg: 'Incorrect format'})
          }
            header = header.replace(/\s+/g, '').toLowerCase();
          const label = obj.label.replace(/\s+/g, '').toLowerCase();
          if (header != label) {
            incorrectColumnNames.push(headerRow[obj.index]);
          }
        });
        if (incorrectColumnNames.length > 0) {
          fs.unlinkSync(filePath)

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
          const dateString = `${year}-${month.length > 1 ? month : `0${month}`}-${date.length > 1 ? date : `0${date}`}`
          const date2 = new Date(dateString);
          return !isNaN(date2.getTime());
        };

        dateColumnValues = dateColumnValues.slice(2)
        dateColumnValues.forEach((ele) => {
          if (!isValidDateString(ele)) {
            fs.unlinkSync(filePath)

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
          fs.unlinkSync(filePath)

          return res
            .status(400)
            .json({ success: false, msg: 'Date cannot be empty' });
        }
        // #endregion
        // #region Validating amounts
        let amountColumnValues = sheet1?.getColumn(amountColumn?.index)?.values; // column number or key

        const isValidAmount = (value) => {
          value = Number(value);
          return (!isNaN(value) && value > 0);
        };
        amountColumnValues = amountColumnValues.slice(2)

        amountColumnValues.forEach((ele) => {
          if (!isValidAmount(ele)) {
            fs.unlinkSync(filePath)

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
          fs.unlinkSync(filePath)

          return res
            .status(400)
            .json({ success: false, msg: 'Amount cannot be empty' });
        }
        //#endregion

        
        // #region Validating debitor account names

        const isAccountExists = async (value) => {
          const account = await models.Accounts.findOne({
            include: [
              {
                model: models.Users,
                attributes: ['id', 'name'],
                where: {
                  name: { [Op.iLike]: value },
                }
              }
            ],
            where: {
              OrgId: orgId
            }
          })
          return !!account;
        };

        let notFoundAccounts = {};

        let debitorAccountNameColumnValues = sheet1?.getColumn(debitorAccountNameColumn?.index)?.values; // column number or key
        debitorAccountNameColumnValues = debitorAccountNameColumnValues?.slice(2)
        
        for(let i = 0; i < debitorAccountNameColumnValues.length; i++){
        // debitorAccountNameColumnValues?.forEach(async (ele) => {
          let ele = debitorAccountNameColumnValues[i].trim()
         if (!(await isAccountExists(ele))) {
            notFoundAccounts[ele] = ele;
          }
        }
      // );

        let creditorAccountNameColumnValues = sheet1?.getColumn(creditorAccountNameColumn?.index)?.values; // column number or key
        creditorAccountNameColumnValues = creditorAccountNameColumnValues?.slice(2)
        
        for(let j = 0; j < creditorAccountNameColumnValues.length; j++){
          let ele = creditorAccountNameColumnValues[j].trim()
          if (!(await isAccountExists(ele))) {
            notFoundAccounts[ele] = ele;
          }
        }

notFoundAccounts = Object.values(notFoundAccounts)

if(notFoundAccounts.length > 0) {
          fs.unlinkSync(filePath)
          return res.status(206).json({
            success: false,
            msg: `Account(s) not found`,
            data: notFoundAccounts
           });
        }
        
        
        //#endregion

        // // #region Validating debitor account types
        // let debitorAccountTypeColumnValues = sheet1.getColumn(debitorAccountTypeColumn.index).values; // column number or key
        // debitorAccountTypeColumnValues = [
        //   ...new Set(
        //     debitorAccountTypeColumnValues
        //   ),
        // ];
        // debitorAccountTypeColumnValues = debitorAccountTypeColumnValues.slice(2);

        // for (let i = 0; i < debitorAccountTypeColumnValues.length; i++) {
        //   if (debitorAccountTypeColumnValues[i] !== 'real' && debitorAccountTypeColumnValues[i] !== 'personal' && debitorAccountTypeColumnValues[i] !== 'nominal') {
        //     fs.unlinkSync(filePath)

        //     return res.status(400).json({
        //       success: false,
        //       msg: `${debitorAccountTypeColumnValues[i]} is not a valid account type`
        //     });
        //   }
        // }
                
        // if (
        //   debitorAccountTypeColumnValues.indexOf(undefined) > 0 ||
        //   debitorAccountTypeColumnValues.indexOf(null) > 0 ||
        //   debitorAccountTypeColumnValues.indexOf('') > 0
        // ) {
        //   fs.unlinkSync(filePath)

        //   return res
        //     .status(400)
        //     .json({ success: false, msg: 'debitor account type cannot be empty' });
        // }
        // //#endregion
        
        // // #region Validating debitor account cash or bank
        // let debitorAccountCashOrBankColumnValues = sheet1.getColumn(debitorAccountCashOrBankColumn.index).values; // column number or key
        // debitorAccountCashOrBankColumnValues = [
        //   ...new Set(
        //     debitorAccountTypeColumnValues
        //   ),
        // ];
        // debitorAccountCashOrBankColumnValues = debitorAccountCashOrBankColumnValues.slice(2);

        // for (let i = 0; i < debitorAccountCashOrBankColumnValues.length; i++) {
        //   if (debitorAccountCashOrBankColumnValues[i] !== 'cash' && debitorAccountCashOrBankColumnValues[i] !== 'bank' && debitorAccountCashOrBankColumnValues[i] !== '') {
        //     fs.unlinkSync(filePath)

        //     return res.status(400).json({
        //       success: false,
        //       msg: `${debitorAccountCashOrBankColumnValues[i]} is not a valid account nature`
        //     });
        //   }
        // }
        // //#endregion

        // // #region Validating creditor account types
        // let creditorAccountTypeColumnValues = sheet1.getColumn(creditorAccountTypeColumn.index).values; // column number or key
        // creditorAccountTypeColumnValues = [
        //   ...new Set(
        //     creditorAccountTypeColumnValues
        //   ),
        // ];
        // creditorAccountTypeColumnValues = creditorAccountTypeColumnValues.slice(2);

        // for (let i = 0; i < creditorAccountTypeColumnValues.length; i++) {
        //   if (creditorAccountTypeColumnValues[i] !== 'real' && creditorAccountTypeColumnValues[i] !== 'personal' && creditorAccountTypeColumnValues[i] !== 'nominal') {
        //     fs.unlinkSync(filePath)

        //     return res.status(400).json({
        //       success: false,
        //       msg: `${creditorAccountTypeColumnValues[i]} is not a valid account type`
        //     });
        //   }
        // }
                
        // if (
        //   creditorAccountTypeColumnValues.indexOf(undefined) > 0 ||
        //   creditorAccountTypeColumnValues.indexOf(null) > 0 ||
        //   creditorAccountTypeColumnValues.indexOf('') > 0
        // ) {
        //   fs.unlinkSync(filePath)

        //   return res
        //     .status(400)
        //     .json({ success: false, msg: 'debitor account type cannot be empty' });
        // }
        // //#endregion
        
        // // #region Validating creditor account cash or bank
        // let creditorAccountCashOrBankColumnValues = sheet1.getColumn(creditorAccountCashOrBankColumn.index).values; // column number or key
        // creditorAccountCashOrBankColumnValues = [
        //   ...new Set(
        //     debitorAccountTypeColumnValues
        //   ),
        // ];
        // creditorAccountCashOrBankColumnValues = creditorAccountCashOrBankColumnValues.slice(2);

        // for (let i = 0; i < creditorAccountCashOrBankColumnValues.length; i++) {
        //   if (creditorAccountCashOrBankColumnValues[i] !== 'cash' && creditorAccountCashOrBankColumnValues[i] !== 'bank' && creditorAccountCashOrBankColumnValues[i] !== '') {
        //     fs.unlinkSync(filePath)

        //     return res.status(400).json({
        //       success: false,
        //       msg: `${creditorAccountCashOrBankColumnValues[i]} is not a valid account nature`
        //     });
        //   }
        // }
        // //#endregion

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
            } else {
              return cell;
            }
          });

          // let date = row[dateColumn.index];
          const year = row[dateColumn.index].split('&')[2];
          const month = row[dateColumn.index].split('&')[1];
          const date = row[dateColumn.index].split('&')[0];
          const dateString = `${year}-${month.length > 1 ? month : `0${month}`}-${date.length > 1 ? date : `0${date}`}`
          const date2 = new Date(dateString);
          let monthNumber = isNaN(parseInt(month)) ? monthNameToNumber(month) : month;
          let particulars = row[particularsColumn.index];
          let amount = row[amountColumn.index];
          let debitorAcc = row[debitorAccountNameColumn.index];
          // let debitorAccType = row[debitorAccountTypeColumn.index];
          // let debitorAccCashOrBank = row[debitorAccountCashOrBankColumn.index];
          let creditorAcc = row[creditorAccountNameColumn.index];
          // let creditorAccType = row[creditorAccountTypeColumn.index];
          // let creditorAccCashOrBank = row[creditorAccountCashOrBankColumn.index];

          // //#region find or create debitor account
          let isDebitorUserExists = await models.Users.findOne({
            where: {
              name: {
                [Op.iLike]: debitorAcc,
              },
              orgId
            }
          })
          
          if (!isDebitorUserExists) {
            await t.rollback();
            fs.unlinkSync(filePath);
            return res.status(404).json({
              success: false,
              msg: `${debitorAcc} not found`
            })
          }
          
          // const accType = await models.AccTypeMasters.findOne({
          //   where: {
          //     name: { [Op.iLike]: debitorAccType }
          //   }
          // })

          // if (!accType) {
          //   fs.unlinkSync(filePath)
          //   throw new Error(`${debitorAccType} is invalid account type`)
          // }

          
          let isDebitorAccountExists = await models.Accounts.findOne({
            where: {
              OrgId: orgId,
              UserId: isDebitorUserExists.id
            }
          })
          // if (!isDebitorAccountExists) {
          //   isDebitorAccountExists = await models.Accounts.create({
          //     OrgId: orgId,
          //     UserId: isDebitorUserExists.id,
          //     isMember: false,
          //     AccTypeId: accType.id,
          //     cashOrBank: debitorAccCashOrBank
          //   })
          // }
          // //#endregion
          
          // //#region find or create creditor account
          let isCreditorUserExists = await models.Users.findOne({
            where: {
              name: {
                [Op.iLike]: creditorAcc,
              },
              orgId
            }
          })

          if (!isCreditorUserExists) {
            await t.rollback();
            fs.unlinkSync(filePath);
            return res.status(404).json({
              success: false,
              msg: `${creditorAcc} not found`
            })
          }
          
          // const credAccType = await models.AccTypeMasters.findOne({
          //   where: {
          //     name: { [Op.iLike]: creditorAccType }
          //   }
          // })

          // if (!credAccType) {
          //   throw new Error(`${creditorAccType} is invalid account type`)
          // }
          
          let isCreditorAccountExists = await models.Accounts.findOne({
            where: {
              OrgId: orgId,
              UserId: isCreditorUserExists.id
            }
          })
          // if (!isCreditorAccountExists) {
          //   isCreditorAccountExists = await models.Accounts.create({
          //     OrgId: orgId,
          //     UserId: isCreditorUserExists.id,
          //     isMember: false,
          //     AccTypeId: credAccType.id,
          //     cashOrBank: creditorAccCashOrBank
          //   })
          // }
          // //#endregion

          // creating journal
          await models.Journals.create(
            {
              OrgId: orgId,
              date: date2,
              particulars,
              DebitorId: isDebitorAccountExists.id,
              CreditorId: isCreditorAccountExists.id,
              amount,
              BkId: userId,
              monthNumber,
              year
            },
            { transaction: t }
          );          
        }
        await t.commit();
        fs.unlinkSync(filePath);
        return res
          .status(200)
          .json({ success: true, msg: 'Journals imported successfully!' });
        } catch (err) {
          await t.rollback();
          throw err;
        }
      }
      else {
        fs.unlinkSync(filePath);
          return res.status(400).json({
            success: false,
            message: 'Please upload a valid .xlsx file',
          });
        }
    }    
      else {
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
