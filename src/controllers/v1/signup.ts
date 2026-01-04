import { Request, Response } from 'express';

const signup = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, msg: 'Signed in successfully' });
};

export { signup };