import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { monthNumberToName } from '../../utils/monthConversion';
import { toTitleCase } from '../../utils/toTitleCase';

export const getDropdowns = async (req: Request, res: Response) => {
  try {
    let { type, page, perPage, search } = req.query;
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    type = String(type);
    search ? search = String(search) : null;
    if (!type) {
      return res.status(400).json({
        success: false,
        msg: 'Type is required',
      });
    }

    const whereConditions = {
      type: type,
      isActive: true,
    };
    if (search) {
      whereConditions.name = { [Op.iLike]: `%${search}%` };
    }
    const { count, rows } = await models.Dropdowns.findAndCountAll({
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
      error: err.message,
    });
  }
};
