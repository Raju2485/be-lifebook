import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { isValidDate } from '../../utils/isValidDate';

export const createAccount = async (req: Request, res: Response) => {
  try {
    let {
      isUserExisting,
      orgId,
      UserId,
      isPerson,
      email,
      name,
      middleName,
      surname,
      AccTypeId,
      isMember,
      RolesIds,
      natureOfAccount,
    } = req.body;

    if (!UserId && isPerson) {
      UserId = await models.Users.create({
        email: String(email.trim()),
        name: String(name.trim()),
        middleName: String(middleName.trim()),
        surName: String(surname.trim())
      }).then(user => user.id);
    }
    else if (!UserId && !isPerson) {
            UserId = await models.Users.create({
              name: String(name.trim()),
              orgId: parseInt(orgId),
            }).then(user => user.id);
    }

    const objToCreate = {
      OrgId: orgId,
      AccTypeId,
      isMember,
      natureOfAccount,
      UserId,
    };

      const isExists = await models.Accounts.findOne({
        where: {
          OrgId: orgId,
          UserId,
        },
      });

      if (isExists) {
        return res
          .status(400)
          .json({ success: false, msg: 'Account already exists' });
      }

    // create account

    const account = await models.Accounts.create(objToCreate);

    if (RolesIds?.length > 0) {
      const rolesArray = RolesIds.map((ele) => {
        return {
          RoleId: ele,
          AccountId: account.id,
        };
      });

      await models.AccRoles.bulkCreate(rolesArray);
    }

    return res.status(200).json({
      success: true,
      msg: 'Account created successfully!',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: err.message,
    });
  }
};
