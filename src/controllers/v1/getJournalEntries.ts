import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize'
import { getLimitAndOffset, getNewPagination} from '../../utils/newPagination'
import { isValidDate} from '../../utils/isValidDate'

export const getJournalEntries = async (req: Request, res: Response) => {
  try {
    const { orgId, page, perPage, search, fromDate, toDate  } = req.query;
    const { id: userId } = req.user;
    const { limit, offset } = getLimitAndOffset({ page, perPage });

    // check if he belongs to the provided organization
    const doTheyBelongsToOrg = await models.Accounts.findOne({
      where: {
        OrgId: Number(orgId),
        UserId: Number(userId),
        isMember: true
      }
    });

    if (!doTheyBelongsToOrg) {
      return res.status(400).json({success: false, msg: 'You do not belongs to this Organization'})
    }
  
    const whereConditions = {
      isActive: true,
      OrgId: orgId
    };
    if (search) {
      whereConditions.particulars = { [Op.iLike]: `%${search}%` }
    }
    if (isValidDate(fromDate) && isValidDate(toDate) && new Date(fromDate) < new Date(toDate)) {
      whereConditions.date = { [Op.between]: [new Date(fromDate), new Date(toDate)] }
    }

    const { count, rows } = await models.Journals.findAndCountAll({
      where: whereConditions,
      include: [{
        model: models.Accounts,
        as: 'Debitor',
        attributes: ['id', 'UserId'],
        include: {
          model: models.Users,
          attributes: ['id', 'name', 'surName', 'middleName', 'email']
        }
      },{
        model: models.Accounts,
        as: 'Creditor',
        attributes: ['id', 'UserId'],
        include: {model: models.Users,
          attributes: ['id', 'name', 'surName', 'middleName', 'email']
        }
      },
      ],
      limit,
      offset,
      order: [['date', 'DESC']]
    });
    
    
    const pagination = getNewPagination({
      count,
      page: page || 1,
      perPage: perPage || 10
    });
    
      return res.status(200).json({
        success: true,
        data: rows,
        pagination
      })

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
