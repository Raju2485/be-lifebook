import { Request, Response } from 'express';
import models from '../../models/index';
const { generateTokens } = require('../../utils/generateTokens')

export const signin = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        let user = await models.Users.findOne({
          where: { email },
        });
        if (!user) {
            return res.status(400).json({success: false, msg: 'Authentication failed'})
        }

        
        user = user?.toJSON();
        const newUser = {
            name: user?.name,
            surName: user?.surName,
            email: user?.email,
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
    return res.status(200).json({ success: true, msg: 'Signed in successfully' })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({success: false, msg:'Something went wrong, we are looking into it'})
    }
}
