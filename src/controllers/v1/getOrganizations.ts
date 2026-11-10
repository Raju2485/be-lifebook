import { Request, Response } from 'express';
import models from '../../models/index';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Organizations } from '../../models/organizations';

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const { search, id, page, perPage } = req.query;
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }
    const { id: userId } = req.user;

    const { limit, offset } = getLimitAndOffset({ page, perPage });

    const whereConditions: WhereOptions<InferAttributes<Organizations>> = {};
    if (search) {
      whereConditions.name = { [Op.iLike]: `%${String(search)}%` };
    }

    if (id) {
      const org = await models.Organizations.findOne({
        where: {
          id: Number(id),
        },
        include: [
          {
            model: models.Accounts,
            where: {
              UserId: userId,
            },
            required: true,
            include: [
              {
                model: models.RoleMasters,
                as: 'Roles',
                through: {
                  attributes: [],
                },
              },
            ],
          },
        ],
      });
      return res.status(200).json({
        success: true,
        data: org,
        metaData: req?.meta ?? null,
      });
    }

    const { count, rows } = await models.Organizations.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: models.Accounts,
          where: {
            UserId: userId,
          },
          required: true,
        },
      ],
      distinct: true,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
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
