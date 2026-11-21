import models from '../models';
import { Op } from 'sequelize';
import {
  getPreviousMonthAndYear,
  type MonthInput,
  type YearInput,
} from './getPreviousMonthAndYear';

export const getPreviouslyAvailableCfMonthAndYear = async ({
  orgId,
  year,
  month,
}: {
  orgId: number;
  year: YearInput;
  month: MonthInput;
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
          model: models.YearsM,
          where: { name: { [Op.lte]: Number(previousYear) } },
        },
        {
          model: models.MonthsM,
          where: { sequence: { [Op.lte]: Number(previousMonthNum) } },
          required: true,
        },
      ],
      order: [
        [models.YearsM, 'name', 'DESC'],
        [models.MonthsM, 'sequence', 'DESC'],
      ],
      limit: 1,
    });

    if (carriedForwards.length > 0) {
      previousCfYearId = carriedForwards[0].YearsM_Id;
      previousCfMonthId = carriedForwards[0].MonthsM_Id;
    }

    return Promise.resolve({
      previousCfYearId: previousCfYearId,
      previousCfMonthId: previousCfMonthId,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
