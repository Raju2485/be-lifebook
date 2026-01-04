import { Request, Response } from 'express';

export const profile = (req: Request, res: Response) => {

    return res.status(200).json({success: true, msg:'Signed in successfully'})
}
