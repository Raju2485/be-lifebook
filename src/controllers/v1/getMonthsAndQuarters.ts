import { Request, Response } from 'express';
import models from '../../models/index';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Months } from '../../models/months';

export const getMonthsAndQuarters = async (req: Request, res: Response) => {
  try {
    const { page, perPage } = req.query;
    let { type, search } = req.query;
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    type = String(type);
    if (search) {
      search = String(search);
    }
    if (!type) {
      return res.status(400).json({
        success: false,
        msg: 'Type is required',
      });
    }

    const typeQuery =
      type === 'monthsAndQuarters' ? { [Op.or]: ['months', 'quarters'] } : type;

    const whereConditions: WhereOptions<InferAttributes<Months>> = {
      type: typeQuery,
      isActive: true,
    };
    if (search) {
      whereConditions.name = { [Op.iLike]: `%${search}%` };
    }
    const { count, rows } = await models.Months.findAndCountAll({
      where: whereConditions,
      attributes: ['id', 'name'],
      limit,
      offset,
      order: [['sequence', 'ASC']],
    });

    const pagination = getNewPagination({
      count,
      page: page || 1,
      perPage: perPage || 10,
    });
    return res.status(200).json({
      success: true,
      data: rows,
      pagination: pagination,
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
