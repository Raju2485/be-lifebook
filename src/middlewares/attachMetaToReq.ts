import { Request, Response, NextFunction } from 'express';
import { getUserOrganizationsAndRoles } from '../utils/getUserOrgsAndRoles';
import { getErrorMessage } from '../utils/getErrorMessage';

export const attachMetadataToRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.id;
    const result = await getUserOrganizationsAndRoles({ userId });

    if ('error' in result) {
      return res.status(result.error.status).json({
        success: false,
        msg: result.error.msg,
      });
    }

    req.meta = result.newUser;

    next();
  } catch (error) {
    console.log('error at token check: ', getErrorMessage(error));

    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: getErrorMessage(error),
    });
  }
};
