import { Request, Response } from 'express';
import models from '../../models/index';
import { Op } from 'sequelize'

export const createOrg = async(req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const { id: userId} = req.user;

        let isExists = await models.Organizations.findOne({
          where: { name: {[Op.iLike]: name} },
        });
      
        if (isExists) {
          return res.status(400).json({
            success: false,
            msg: `${name} already exists`
          })
        }
        else {
          // Creating organization
          const org = await models.Organizations.create({ name });
          
          //#region Creating account type master if not exists
          let accType = await models.AccTypeMasters.findOne({
            where: { name: { [Op.iLike]: 'personal' } }
          });
          if (!accType) {
            accType = await models.AccTypeMasters.create({
              name: 'personal',
              goldenRule: 'Debit the receiver, Credit the giver'
            })
          }
          //#endregion

          //Creating account
          const account = await models.Accounts.create({
            OrgId: org.id,
            UserId: userId,
            AccTypeId: accType.id,
            isAdmin: true,
            isMember: true
          })

          // //#region Adding admin role to created account
          // let adminRole = await models.RoleMasters.findOne({
          //   where: { name: { [Op.iLike]: 'admin' } }
          // });
          // if (!adminRole) {
          //   adminRole = await models.RoleMasters.create({name: 'admin'})
          // }

          // await models.AccRoles.create({
          //   RoleId: adminRole.id,
          //   AccountId: account.id
          // })

          // //#endregion
          return res.status(200).json({ success: true, msg: 'Organization created successfully!' });
        }
      
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({success: false, msg:'Something went wrong, we are looking into it'})
    }
}
