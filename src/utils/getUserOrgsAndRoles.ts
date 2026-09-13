import models from '../models/index';
import { compare } from 'bcrypt';
import { Op } from 'sequelize';
import { Response } from 'express';

export const getUserOrganizationsAndRoles = async ({
  email,
  password,
  userId,
  res,
}: {
  email: string;
  password: string;
  userId: number;
  res: Response;
}) => {
  try {
    let whereConditions = {};
    if (userId) {
      whereConditions = { id: userId };
    } else {
      whereConditions = { email: { [Op.iLike]: email }, isActive: true };
    }

    let user = await models.Users.findOne({
      where: whereConditions,
      include: [
        {
          model: models.Accounts,
          required: false,
          where: {
            isMember: true,
          },
          include: [
            {
              model: models.RoleMasters,
              as: 'Roles',
              through: { attributes: [] },
            },
            {
              model: models.Organizations,
            },
          ],
        },
      ],
    });
    if (email && password && !user) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid email or password',
      });
    }

    // user = JSON.parse(JSON.stringify(user))

      if (email && password) {
          const isPasswordCorrect = await compare(password, user.password || '');
          if (!isPasswordCorrect) {
              return res.status(400).json({
                  success: false,
                  msg: 'Invalid email or password',
              });
          }
      }
      
      const userData = user?.toJSON ? user.toJSON() : user;
      const orgsAndRoles =
        userData?.Accounts?.map((account) => {
          const org = {};
          org.id = account?.Organization?.id || '';
          org.name = account?.Organization?.name || '';
          org.isAdmin = account?.isAdmin || false;
          org.isMember = account?.isMember || false;
          org.roles = account?.Roles?.map((role) => role.name) || [];
          return org;
        }) || [];
      const newUser = {
        id: userData?.id,
        name: userData?.name,
        surName: userData?.surName,
        email: userData?.email,
        orgsAndRoles,
      };

      return { newUser };

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: error.message,
    });
  }
};
