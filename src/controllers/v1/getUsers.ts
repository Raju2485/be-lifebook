import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize'
import { getLimitAndOffset, getNewPagination} from '../../utils/newPagination'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { orgId, search, page, perPage } = req.query;
    // const { id: userId } = req.user;
      if(!orgId){
        return res.status(400).json({success:false, msg: 'orgId is mandatory'})
      }
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    let whereConditions = {
      isActive: true,
      orgId:{[Op.or]:[null, orgId]}
    };
    if (search) {
      whereConditions = {
        isActive: true,
        orgId:{[Op.or]:[null, orgId]},
        [Op.or]: [
          {name:{ [Op.iLike]: `%${search}%`} },
          {middleName:{ [Op.iLike]: `%${search}%`} },
          {surName:{ [Op.iLike]: `%${search}%`} },
          {email:{ [Op.iLike]: `%${search}%`} },
        ]
      }
      if (!isNaN(Number(search))) {
        whereConditions[Op.or].push({ uid: Number(search) });
      }
      
  }

    // getting users
    const { count, rows } = await models.Users.findAndCountAll({
      where: whereConditions,
      attributes: ['id', 'name', 'middleName', 'surName', 'email', 'uid'],
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
