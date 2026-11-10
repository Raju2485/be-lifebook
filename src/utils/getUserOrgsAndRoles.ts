import models from '../models/index';
import { compare } from 'bcrypt';
import { Op } from 'sequelize';
import type { OrgAndRole, RequestMeta } from '../types/auth';
import { getErrorMessage } from './getErrorMessage';

type GetUserOrgsAndRolesParams = {
  email?: string;
  password?: string;
  userId?: number;
};

type GetUserOrgsAndRolesSuccess = {
  newUser: RequestMeta;
};

type GetUserOrgsAndRolesFailure = {
  error: {
    status: number;
    msg: string;
  };
};

export type GetUserOrgsAndRolesResult =
  | GetUserOrgsAndRolesSuccess
  | GetUserOrgsAndRolesFailure;

export const getUserOrganizationsAndRoles = async ({
  email,
  password,
  userId,
}: GetUserOrgsAndRolesParams): Promise<GetUserOrgsAndRolesResult> => {
  try {
    const whereConditions = userId
      ? { id: userId }
      : { email: { [Op.iLike]: email }, isActive: true };

    const user = await models.Users.findOne({
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
      return {
        error: {
          status: 400,
          msg: 'Invalid email or password',
        },
      };
    }

    if (email && password) {
      const isPasswordCorrect = await compare(password, user?.password || '');
      if (!isPasswordCorrect) {
        return {
          error: {
            status: 400,
            msg: 'Invalid email or password',
          },
        };
      }
    }

    const orgsAndRoles: OrgAndRole[] =
      user?.Accounts?.map((account) => {
        const org: OrgAndRole = {
          id: account?.Organization?.id || '',
          name: account?.Organization?.name || '',
          isAdmin: account?.isAdmin || false,
          isMember: account?.isMember || false,
          roles: account?.Roles?.map((role) => role.name) || [],
        };
        if (org.isAdmin) org.roles.push('admin');
        if (org.isMember) org.roles.push('member');
        return org;
      }) || [];

    const newUser: RequestMeta = {
      id: user?.id as number,
      name: user?.name || '',
      surName: user?.surName ?? null,
      email: user?.email ?? null,
      orgsAndRoles,
    };

    return { newUser };
  } catch (error) {
    console.error(error);
    return {
      error: {
        status: 400,
        msg: getErrorMessage(error) || 'Something went wrong, we are looking into it',
      },
    };
  }
};
