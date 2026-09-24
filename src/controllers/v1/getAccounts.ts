import { Request, Response } from 'express';
import models from '../../models/index';
import { Op } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';

export const getAccounts = async (req: Request, res: Response) => {
  try {
    let { orgId, search, page, perPage } = req.query;
    if (search) {
      search = String(search);
    }
    // const { id: userId } = req.user;

    const { limit, offset } = getLimitAndOffset({ page, perPage });

    let whereConditions = {};
    if (search) {
      whereConditions = {
        [Op.or]: [
          {
            name: { [Op.iLike]: `%${search}%` },
          },
          {
            email: { [Op.iLike]: `%${search}%` },
          },
        ],
      };
      if (!isNaN(Number(search))) {
        whereConditions[Op.or].push({ uid: Number(search) });
      }
    }

    // getting users
    const { count, rows } = await models.Accounts.findAndCountAll({
      where: {
        OrgId: orgId,
        isActive: true,
      },
      attributes: ['id'],
      include: [
        {
          model: models.Users,
          ...(search ? { where: whereConditions, required: true } : {}),
          attributes: ['id', 'name', 'middleName', 'surName', 'email', 'uid'],
        },
        {
          model: models.AccTypeMasters,
          attributes: ['id', 'name', 'goldenRule'],
        },
        {
          model: models.RoleMasters,
          as: 'Roles',
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          }
        },
      ],
      distinct: true,
      // Avoid subquery pagination that ORDER BY User.name without joining Users.
      subQuery: false,
      limit,
      offset,
      order: [[{ model: models.Users }, 'name', 'ASC']],
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
      error: err.message,
    });
  }
};
