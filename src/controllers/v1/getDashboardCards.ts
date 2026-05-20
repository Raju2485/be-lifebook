import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';

export const getCards = async (req: Request, res: Response) => {
  try {
    let { type, search, page, perPage } = req.query;
    if (!type) {
      return res.status(400).json({success: false, msg: 'type is mandatory'})
    }
    if (search) {
      search = String(search);
    }
    // const { id: userId } = req.user;

    const { limit, offset } = getLimitAndOffset({ page, perPage });

    let whereConditions = {
      type,
      isActive: true,
    };
    if (search) {
      whereConditions = {
        [Op.or]: [
          {
            name: { [Op.iLike]: `%${search}%` },
          },
        ],
      };
    }

    // getting users
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
