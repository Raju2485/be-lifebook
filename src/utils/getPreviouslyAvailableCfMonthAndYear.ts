const jwt = require('jsonwebtoken');
import models from '../models';
import { Op, Sequelize } from 'sequelize';
import { getPreviousMonthAndYear } from './getPreviousMonthAndYear';

export const getPreviouslyAvailableCfMonthAndYear = async ({
  orgId,
  year,
  month,
}: {
  orgId: number;
  year: Object;
  month: Object;
}) => {
  try {
    if (!orgId || !year || !month) {
      return Promise.reject('orgId, year and month are incorrect');
    }

    const { previousMonthNum, previousYear } = await getPreviousMonthAndYear({
      month,
      year,
    });

    let previousCfYearId: number | false = false;
    let previousCfMonthId: number | false = false;

    const carriedForwards = await models.CarriedForwards.findAll({
      where: {
        OrgId: Number(orgId),
      },
      include: [
        {
          model: models.Years,
          where: { name: { [Op.lte]: Number(previousYear) } },
        },
        {
          model: models.Months,
          where: { sequence: { [Op.lte]: Number(previousMonthNum) } },
          required: true,
        },
      ],
      order: [
        [models.Years, 'name', 'DESC'],
        [models.Months, 'sequence', 'DESC'],
      ],
      limit: 1,
    });

    if (carriedForwards.length > 0) {
      previousCfYearId = carriedForwards[0].YearId;
      previousCfMonthId = carriedForwards[0].MonthId;
    }

    return Promise.resolve({
      previousCfYearId: previousCfYearId,
      previousCfMonthId: previousCfMonthId,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
