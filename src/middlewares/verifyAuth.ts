const jwt = require('jsonwebtoken');
import config from '../config/config';
import { Request, Response, NextFunction } from 'express';
import type { JwtUserPayload } from '../types/auth';
import { getErrorMessage } from '../utils/getErrorMessage';

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY) as JwtUserPayload;

    req.user = decoded;

    next();
  } catch (error) {
    const message = getErrorMessage(error);
    console.log('error at token check: ', message);
    if (message == 'jwt expired') {
      return res.status(401).json({
        success: false,
        msg: 'Unauthorized',
        error: message,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: 'Something went wrong, we are looking into it',
        error: message,
      });
    }
  }
};
