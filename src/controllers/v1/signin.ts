import { Request, Response } from 'express';
import models from '../../models/index';
const { generateTokens } = require('../../utils/generateTokens')
import {compare} from 'bcrypt'

export const signin = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        let user = await models.Users.findOne({
          where: { 
            email, 
            isActive: true 
          },
          include: [{
            model: models.Accounts,
            where: {
              isMember: true,
            },
            include: [{
              model: models.RoleMasters,
              as: 'Roles',
              through: { attributes: [] }
            },
              {
              model: models.Organizations
             }]

          }]
        });
        if (!user) {
            return res.status(400).json({success: false, msg: 'Email does not exists'})
      }
      
      // user = JSON.parse(JSON.stringify(user))

      const isPasswordCorrect = await compare(
        password,
        user.password
      );

      if (isPasswordCorrect) {

        const userData = user?.toJSON ? user.toJSON() : user;
        const orgsAndRoles = userData?.Accounts?.map(account => {
          const org = {}
          org.id = account?.Organization?.id || '';
          org.name = account?.Organization?.name || '';
          org.roles = account?.Roles?.map(role => role.name) || [];
          return org;
        }) || [];
        const newUser = {
          id: userData?.id,
          name: userData?.name,
          surName: userData?.surName,
          email: userData?.email,
          orgsAndRoles
        }
        const { accessToken, refreshToken } = await generateTokens(newUser);

      
        return res.status(200).json({
          success: true,
          msg: `Hello, ${user?.name}! Welcome to the Lifebook App`,
          accessToken,
          refreshToken,
          user_details: newUser,
        });
      }
      else {
        return res.status(400).json({success: false, msg: 'Authentication failed'})
      }
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
