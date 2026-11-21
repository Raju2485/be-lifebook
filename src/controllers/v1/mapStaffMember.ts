import { Request, Response } from 'express';
import models from '../../models/index';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { Op } from 'sequelize';

export const mapStaffMember = async (req: Request, res: Response) => {
  try {
    const { UserId, OrgId, RolesIds } = req.body;

    if (!UserId || !OrgId || !Array.isArray(RolesIds) || RolesIds.length === 0) {
      return res.status(400).json({
        success: false,
        msg: 'UserId, OrgId and RolesIds are required',
        metaData: req?.meta ?? null,
      });
    }
    let orgUser = await models.StaffJ.findOne({
      where: {
        UserId: Number(UserId),
        OrgId: Number(OrgId),
      },
    });

    if (orgUser) {
      return res.status(400).json({
        success: false,
        msg: 'User already mapped to this organization',
        metaData: req?.meta ?? null,
      });
    }

    orgUser = await models.StaffJ.create({
      UserId: Number(UserId),
      OrgId: Number(OrgId),
    });
    await models.StaffRoles.bulkCreate(
      RolesIds.map((roleId: number) => ({
        OrgUserId: orgUser.id,
        RolesM_Id: roleId,
      }))
    );


    return res.status(200).json({
      success: true,
      msg: 'User mapped to organization and roles successfully!',
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
