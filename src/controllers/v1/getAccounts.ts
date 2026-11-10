import { Request, Response } from 'express';
import models from '../../models/index';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Users } from '../../models/users';

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { orgId, page, perPage } = req.query;
    let { search } = req.query;
    if (search) {
      search = String(search);
    }

    const { limit, offset } = getLimitAndOffset({ page, perPage });

    let userWhere: WhereOptions<InferAttributes<Users>> | undefined;
    if (search) {
      const orClause: WhereOptions<InferAttributes<Users>>[] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
      if (!isNaN(Number(search))) {
        orClause.push({ uid: Number(search) });
      }
      userWhere = { [Op.or]: orClause };
    }

    const { count, rows } = await models.Accounts.findAndCountAll({
      where: {
        OrgId: Number(orgId),
        isActive: true,
      },
      attributes: ['id'],
      include: [
        {
          model: models.Users,
          ...(userWhere ? { where: userWhere, required: true } : {}),
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
          },
        },
      ],
      distinct: true,
      subQuery: false,
      limit,
      offset,
      order: [[{ model: models.Users, as: 'User' }, 'name', 'ASC']],
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
