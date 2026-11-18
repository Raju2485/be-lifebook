import { Request, Response } from 'express';
import models from '../../models/index';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { Op, WhereOptions, InferAttributes, Sequelize } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import type { Staff } from '../../models/Staff';


export const getStaffMembers = async (req: Request, res: Response) => {
  try {
    const { OrgId, search, page, perPage } = req.query;

    if (!OrgId) {
      return res.status(400).json({
        success: false,
        msg: 'OrgId is required',
        metaData: req?.meta ?? null,
      });
    }

    const { limit, offset } = getLimitAndOffset({ page, perPage });

    const whereConditions: WhereOptions<InferAttributes<Staff>> = {
      OrgId: Number(OrgId),
    };

    if (search) {
      Object.assign(whereConditions, {
        [Op.and]: Sequelize.where(Sequelize.col('User.handle'), {
          [Op.iLike]: `%${String(search)}%`,
        }),
      });
    }

     const { count, rows } = await models.Staff.findAndCountAll({
       where: whereConditions,
       include: [
         {
           model: models.Users,
         },
         {
           model: models.Organizations,
         },

         {
           model: models.RoleMasters,
         },

       ],
       limit,
       offset,
       order: [[models.Users, 'name', 'ASC']],
     });


    return res.status(200).json({
      success: true,
      data: rows,
      pagination: getNewPagination({
        count,
        page: page || 1,
        perPage: perPage || 10,
      }),
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
