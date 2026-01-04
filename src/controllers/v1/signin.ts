import { Request, Response } from 'express';
import models from '../../models/index'

export const signin = async(req: Request, res: Response) => {
    try {
        const data = await models.Users.findOne();
        console.log(data?.dataValues)

    return res.status(200).json({ success: true, msg: 'Signed in successfully' })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({success: false, msg:'Something went wrong, we are looking into it'})
    }
}
