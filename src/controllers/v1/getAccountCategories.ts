import { Request, Response } from 'express';
import models from '../../models/index';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { AccCategs } from '../../models/accCategs';

export const getAccountCategories = async (req: Request, res: Response) => {
  try {
    const { search, page, perPage } = req.query;
    // const { id: userId } = req.user;
      
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    const whereConditions: WhereOptions<InferAttributes<AccCategs>> = {};
    if (search) {
      whereConditions.name = { [Op.iLike]: `%${String(search)}%` };
    }

    // getting users
    const { count, rows } = await models.AccCategs.findAndCountAll({
      where: whereConditions,
      attributes: ['id', 'name', 'debitCreditRule'],
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    const pagination = getNewPagination({
      count,
      page: page || 1,
      perPage: perPage || 10});
  
  return res.status(200).json({
    success: true,
    data: rows,
    pagination: pagination,
    metaData: req?.meta ?? null,
  });
} 
    catch (err) {
        console.log(err)
      return res.status(400).json({
        success: false,
        msg: 'Something went wrong, we are looking into it',
        error: getErrorMessage(err)
      })
    }
}
