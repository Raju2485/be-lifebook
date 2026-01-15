import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize'
import { getLimitAndOffset, getNewPagination} from '../../utils/newPagination'
import { isValidDate} from '../../utils/isValidDate'

export const createAccount = async (req: Request, res: Response) => {
  try {
    let {
      orgId,
      UserId,
      name,
      AccTypeId,
      isMember,
      RolesIds,
      cashOrBank
    } = req.body;

    const objToCreate = {
      OrgId: orgId,
      AccTypeId,
      isMember,
      cashOrBank
    }

    const isAccountExists = async({UserId, orgId}) => {
        const isExists = await models.Accounts.findOne({
          where:{
            OrgId: orgId,
          UserId
        }
      })

      if(isExists){
      return res.status(400).json({success: false, msg: 'Account already exists'})
      }
      return isExists
    }

  if(UserId){
    // Check if the account exists
      
    const isExists = await isAccountExists({ UserId, orgId })
    if (!isExists) {
      objToCreate.UserId = UserId
    }

    if(name || cashOrBank){
      return res.status(400).json({success: false, msg: 'Account creating with UserId,  name cannot be notnull or cashOrBank cannot be notnull'})
    }

    if(isMember){
      const user = await models.Users.findOne({
          where:{
            id: UserId
          },
          attributes: ['id', 'orgId']
        })
  
        if(user?.orgId){
          return res.status(400).json({success: false, msg: 'Accounts created by admin/book keeper, cannot be added as member'});
        }
  
      }
  }
  else if(name){
    if(isMember || RolesIds.length > 0){
      return res.status(400).json({success: false, msg: 'Account creating with name, isMember cannot be true or RolesIds notnull'})
    }
    let user = await models.Users.findOne({
      where: {
        name,
        orgId,
      },
    });
    if (!user) {
      user = await models.Users.create({
        name,
        orgId,
      });
    }
    const isExists = await isAccountExists({ UserId: user.id, orgId })


    objToCreate.UserId = user.id;
    objToCreate.isMember = false;
  }

    // Validations
    const accType = await models.AccTypeMasters.findOne({
      where: {
        id: AccTypeId
      }
    })

    if (!accType) {
      return res.status(400).json({success: false, msg: 'Given AccTypeId not available'})
    }
    else if(accType.name != 'real' && cashOrBank ) {
      return res.status(400).json({success: false, msg: 'Only real account type can be cashOrBank account'})
    }

    // create account

    const account = await models.Accounts.create(objToCreate)

    if (RolesIds.length > 0) {
      const rolesArray = RolesIds.map(ele => {
        return {
          RoleId: ele,
          AccountId: account.id
        }
      });

      await models.AccRoles.bulkCreate(rolesArray)
    }

      return res.status(200).json({
        success: true,
        msg: 'Account created successfully!',
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
