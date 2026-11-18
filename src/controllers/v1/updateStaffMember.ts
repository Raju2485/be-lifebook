import { Request, Response } from 'express';
import models from '../../models/index';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { Op } from 'sequelize';

export const updateStaffMember = async (req: Request, res: Response) => {
  try {
    const { id, isActive, RolesIds } = req.body;

    if (!id || isActive === undefined) {
      return res.status(400).json({
        success: false,
        msg: 'id and isActive are required',
        metaData: req?.meta ?? null,
      });
    }
    const staff = await models.Staff.findByPk(id);
    if (!staff) {
      return res.status(400).json({
        success: false,
        msg: 'Staff member not found',
        metaData: req?.meta ?? null,
      });
    }
    const updated = await models.Staff.update({
      isActive: isActive,
    }, {
      where: {
        id: id,
      },
      returning: true,
    });

    await models.StaffRoles.destroy({
      where: {
        StaffId: id,
      },
    });

    console.log('updated = ', updated);

    if (RolesIds.length > 0) {
      await models.StaffRoles.bulkCreate(RolesIds.map((roleId: number) => ({
        StaffId: id,
        RoleId: roleId,
      })));
    }

    return res.status(200).json({
      success: true,
      msg: 'Staff member updated successfully!',
      metaData: req?.meta ?? null,
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
