import { Request, Response } from 'express';
const { generateTokens } = require('../../utils/generateTokens');
import { getUserOrganizationsAndRoles } from '../../utils/getUserOrgsAndRoles';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: 'Email and password are required' });
    }

    const result = await getUserOrganizationsAndRoles({
      email,
      password,
    });

    if ('error' in result) {
      return res.status(result.error.status).json({
        success: false,
        msg: result.error.msg,
      });
    }

    const { newUser } = result;
    const { accessToken, refreshToken } = await generateTokens(newUser);

    return res.status(200).json({
      success: true,
      msg: `Hello, ${newUser?.name}! Welcome to the Lifebook App`,
      accessToken,
      refreshToken,
      metaData: newUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: getErrorMessage(err),
    });
  }
};
