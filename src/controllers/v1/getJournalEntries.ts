import { Request, Response } from 'express';
import models from '../../models/index';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { isValidDate } from '../../utils/isValidDate';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Journals } from '../../models/journals';

export const getJournalEntries = async (req: Request, res: Response) => {
  try {
    const { orgId, page, perPage, search, fromDate, toDate } = req.query;
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }
    const { id: userId } = req.user;
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    const doTheyBelongsToOrg = await models.Accounts.findOne({
      where: {
        OrgId: Number(orgId),
        UserId: Number(userId),
        isMember: true,
      },
    });

    if (!doTheyBelongsToOrg) {
      return res
        .status(400)
        .json({ success: false, msg: 'You do not belongs to this Organization' });
    }

    const whereConditions: WhereOptions<InferAttributes<Journals>> = {
      isActive: true,
      OrgId: Number(orgId),
    };
    if (search) {
      whereConditions.particulars = { [Op.iLike]: `%${String(search)}%` };
    }
    const from = typeof fromDate === 'string' ? fromDate : undefined;
    const to = typeof toDate === 'string' ? toDate : undefined;
    if (
      from &&
      to &&
      isValidDate(from) &&
      isValidDate(to) &&
      new Date(from) < new Date(to)
    ) {
      whereConditions.date = {
        [Op.between]: [new Date(from), new Date(to)],
      };
    }

    const { count, rows } = await models.Journals.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: models.Accounts,
          as: 'Debtor',
          attributes: ['id', 'UserId'],
          include: [
            {
              model: models.Users,
              attributes: [
                'id',
                'name',
                'surName',
                'middleName',
                'email',
                'uid',
              ],
            },
          ],
        },
        {
          model: models.Accounts,
          as: 'Creditor',
          attributes: ['id', 'UserId'],
          include: [
            {
              model: models.Users,
              attributes: [
                'id',
                'name',
                'surName',
                'middleName',
                'email',
                'uid',
              ],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [['date', 'DESC']],
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
