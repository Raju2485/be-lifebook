import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { monthNumberToName } from '../../utils/monthConversion';
import { toTitleCase } from '../../utils/toTitleCase';

export const getYearsAndMonths = async (req: Request, res: Response) => {
  try {
    let { type, orgId } = req.query;
    type = String(type);
    orgId = String(orgId);
    if (!type || !orgId) {
      return res.status(400).json({
        success: false,
        msg: 'Type and orgId are required',
      });
    }

    if (type === 'financial-reports') {
      const journals = await models.Journals.findAll({
        where: {
          OrgId: orgId,
          isActive: true,
        },
        attributes: ['year', 'monthNumber'],
        raw: true,
        group: ['year', 'monthNumber'],
        order: [
          ['year', 'DESC'],
          ['monthNumber', 'ASC'],
        ],
      });

      const yearsAndMonths = [];
      for (let i = 0; i < journals.length; i++) {
        const journal = journals[i];
        const year = journal.year;
        const monthNumber = journal.monthNumber;
        const monthName = toTitleCase(monthNumberToName(monthNumber));

        const yearIndex = yearsAndMonths.findIndex((obj) => obj.year === year);
        if (yearIndex === -1) {
          yearsAndMonths.push({ year, months: [monthName] });
        } else {
          const monthIndex = yearsAndMonths[yearIndex].months.findIndex(
            (ele) => ele === monthName
          );
          if (monthIndex === -1) {
            yearsAndMonths[yearIndex].months.push(monthName);
          }
        }
      }

      return res.status(200).json({
        success: true,
        data: yearsAndMonths,
      });
    }

    return res.status(400).json({
      success: false,
      msg: 'Invalid type',
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
