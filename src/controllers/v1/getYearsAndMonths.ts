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
        attributes: ['YearId', 'MonthId'],
        // attributes: ['year', 'monthNumber'],
        include: [
          {
            model: models.Months,
          },
          {
            model: models.Years,
          },
        ],
        raw: true,
        group: ['YearId', 'MonthId', 'Month.id', 'Year.id'],
        // group: ['year', 'monthNumber'],
        // order: [
        //   ['year', 'DESC'],
        //   ['monthNumber', 'ASC'],
        // ],
      });


      let yearsAndMonths = [];
      for (let i = 0; i < journals.length; i++) {
        const journal = journals[i];
        console.log('journal = ', journal);
        const year = Number(journal['Year.name']);
        const yearId = Number(journal.YearId);
        const monthName = toTitleCase(journal['Month.name']);
        const monthNum = journal['Month.sequence'];
        const monthId = journal.MonthId;

        const yearIndex = yearsAndMonths.findIndex((obj) => obj.year === year);
        if (yearIndex === -1) {
          yearsAndMonths.push({ id: yearId, year, months: [{ id: monthId, monthName, monthNum }] });
        } else {
          const monthIndex = yearsAndMonths[yearIndex].months.findIndex(
            (obj) => obj.monthName === monthName
          );
          if (monthIndex === -1) {
            yearsAndMonths[yearIndex].months.push({
              id: monthId,
              monthName,
              monthNum,
            });
          }
        }
      }

      yearsAndMonths.sort((a, b) => b.year - a.year);
      yearsAndMonths.forEach((item) => {
        item.months.sort((a, b) => a.monthNum - b.monthNum);
      });;

      return res.status(200).json({
        success: true,
        data: yearsAndMonths,
        metaData: req?.meta ?? null,
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
