const jwt = require('jsonwebtoken');
import config from '../config/config';
import { Request, Response, NextFunction } from 'express';
import models from '../models/index';
import { getUserOrganizationsAndRoles } from '../utils/getUserOrgsAndRoles';

export const attachMetadataToRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.id;
    const { newUser } = await getUserOrganizationsAndRoles({ userId, res });
    
    (req as any).meta = newUser;
    
    // Call the next middleware
    next();
  } catch (error) {
    console.log('error at token check: ', error.message);

    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: error?.message,
    });
  }
};
