import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize'
import { getLimitAndOffset, getNewPagination} from '../../utils/newPagination'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, page, perPage } = req.query;
    // const { id: userId } = req.user;
      
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    const whereConditions = {
      isActive: true
    };
    if (search) {
      whereConditions.name = { [Op.iLike]: `%${search}%` }
    }

    // getting users
    const { count, rows } = await models.Users.findAndCountAll({
      where: whereConditions,
      attributes: ['id', 'name', 'middleName', 'surName', 'email'],
      limit,
      offset,
      order: [['name', 'ASC']]
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
