import { Request, Response } from 'express';
import models from '../../models/index';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Cards } from '../../models/cards';

export const getCards = async (req: Request, res: Response) => {
  try {
    const { type, page, perPage } = req.query;
    let { search } = req.query;
    if (!type) {
      return res.status(400).json({ success: false, msg: 'type is mandatory' });
    }
    if (search) {
      search = String(search);
    }

    const { limit, offset } = getLimitAndOffset({ page, perPage });

    let whereConditions: WhereOptions<InferAttributes<Cards>> = {
      type: String(type),
      isActive: true,
    };
    if (search) {
      whereConditions = {
        type: String(type),
        isActive: true,
        [Op.or]: [
          {
            name: { [Op.iLike]: `%${search}%` },
          },
        ],
      };
    }

    const { count, rows } = await models.Cards.findAndCountAll({
      where: whereConditions,
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
