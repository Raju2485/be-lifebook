import { Request, Response } from 'express';
import models from '../../models/index';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Users } from '../../models/users';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const {
      // orgId,
      search,
      page,
      perPage,
    } = req.query;
    // if (!orgId) {
    //   return res.status(400).json({ success: false, msg: 'orgId is mandatory' });
    // }
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    let whereConditions: WhereOptions<InferAttributes<Users>> = {
      isActive: true,
    };
    if (search) {
      const searchStr = String(search);
      const orClause: WhereOptions<InferAttributes<Users>>[] = [
        { name: { [Op.iLike]: `%${searchStr}%` } },
        { handle: { [Op.iLike]: `%${searchStr}%` } },
      ];

      whereConditions = {
        isActive: true,
        [Op.or]: orClause,
      };
    }

    const { count, rows } = await models.Users.findAndCountAll({
      where: whereConditions,
      attributes: ['id', 'name', 'middleName', 'surName', 'email', 'handle'],
      limit,
      offset,
      order: [['name', 'ASC']],
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
