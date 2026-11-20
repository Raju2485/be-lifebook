import models from '../models/index';
import { compare } from 'bcrypt';
import { Op } from 'sequelize';
import type { StaffAndRoles, RequestMeta } from '../types/auth';
import { getErrorMessage } from './getErrorMessage';
import type { Staff } from '../models/staffJ';
import type { RoleMasters } from '../models/rolesM';
import type { Organizations } from '../models/organizations';

type GetStaffRolesParams = {
  email?: string;
  password?: string;
  userId?: number;
};

type GetStaffRolesSuccess = {
  newUser: RequestMeta;
};

type GetStaffRolesFailure = {
  error: {
    status: number;
    msg: string;
  };
};

type StaffWithAssocs = Staff & {
  Organization?: Organizations;
  RoleMasters?: RoleMasters[];
};

export type GetStaffRolesResult = GetStaffRolesSuccess | GetStaffRolesFailure;

export const getStaffRoles = async ({
  email,
  password,
  userId,
}: GetStaffRolesParams): Promise<GetStaffRolesResult> => {
  try {
    const whereConditions = userId
      ? { id: userId }
      : { email: { [Op.iLike]: email }, isActive: true };

    const user = await models.Users.findOne({
      where: whereConditions,
      include: [
        {
          model: models.Staff,
          required: false,
          where: { isActive: true },
          include: [
            {
              model: models.Organizations,
            },
            {
              model: models.RoleMasters,
              // through: { attributes: [] },
            },
          ],
        },
      ],
    });

    // console.log('user = ', JSON.stringify(user));

    if (email && password && !user) {
      return {
        error: {
          status: 400,
          msg: 'Invalid email or password',
        },
      };
    }

    if (!user) {
      return {
        error: {
          status: 400,
          msg: 'User not found',
        },
      };
    }

    if (email && password) {
      const isPasswordCorrect = await compare(password, user.password || '');
      if (!isPasswordCorrect) {
        return {
          error: {
            status: 400,
            msg: 'Invalid email or password',
          },
        };
      }
    }

    const staffRows = (user as typeof user & { Staff?: StaffWithAssocs[] })
      .Staffs;

    const staffAndRoles: StaffAndRoles[] =
      staffRows?.map((staffMember) => {
        const roles =
          staffMember.RoleMasters?.map((role) => role.name).filter(Boolean) ||
          [];
        if (staffMember.isAdmin && !roles.includes('admin')) {
          roles.push('admin');
        }
        return {
          id: staffMember.Organization?.id ?? staffMember.OrgId,
          name: staffMember.Organization?.name || '',
          isAdmin: staffMember.isAdmin || false,
          isMember: false,
          roles,
        };
      }) || [];

    const newUser: RequestMeta = {
      id: user.id,
      name: user.name || '',
      surName: user.surName ?? null,
      email: user.email ?? null,
      staffAndRoles,
    };

    return { newUser };
  } catch (error) {
    console.error(error);
    return {
      error: {
        status: 400,
        msg:
          getErrorMessage(error) ||
          'Something went wrong, we are looking into it',
      },
    };
  }
};
