import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize'
import { getLimitAndOffset, getNewPagination} from '../../utils/newPagination'

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const { search, id, page, perPage } = req.query;
    const { id: userId } = req.user;
      
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    const whereConditions = {
      // isActive: true
    };
    if (search) {
      whereConditions.name = { [Op.iLike]: `%${search}%` }
    }

    if (id) {
      const org = await models.Organizations.findOne({
        where: {
          id: Number(id)
        }
      })
      return res.status(200).json({
        success: true,
        data: org
      })
    }
    // getting organization
    const { count, rows } = await models.Organizations.findAndCountAll({
      where: whereConditions,
      include: [{
        model: models.Accounts,
        where: {
          UserId: userId,
        },
        required: true,
      }],
      distinct: true,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const pagination = getNewPagination({
      count,
      page: page || 1,
      perPage: perPage || 10});
  
  return res.status(200).json({
    success: true,
    data: rows,
    pagination: pagination
  });
} 
    catch (err) {
        console.log(err)
      return res.status(400).json({
        success: false,
        msg: 'Something went wrong, we are looking into it',
        error: err.message
      })
    }
}
