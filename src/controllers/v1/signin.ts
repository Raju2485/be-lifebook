import { Request, Response } from 'express';
import models from '../../models/index';
const { generateTokens } = require('../../utils/generateTokens')
import {compare} from 'bcrypt'

export const signin = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        let user = await models.Users.findOne({
          where: { email, isActive: true },
        });
        if (!user) {
            return res.status(400).json({success: false, msg: 'Email does not exists'})
      }
      
      const isPasswordCorrect = await compare(
        password,
        user.password
      );

      if (isPasswordCorrect) {

        const userData = user?.toJSON ? user.toJSON() : user;
        const newUser = {
          name: userData?.name,
          surName: userData?.surName,
          email: userData?.email,
        }
        const { accessToken, refreshToken } = await generateTokens(newUser);

        await models.AccessAndRefreshTokens.create({ accessToken, refreshToken, UserId: user?.id });
      
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
        return res.status(400).json({success: false, msg:'Something went wrong, we are looking into it'})
    }
}
