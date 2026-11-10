import { Request, Response } from 'express';
import models from '../../models/index';
import { Op } from 'sequelize';

export const createOrg = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }
    const { id: userId } = req.user;

    const isExists = await models.Organizations.findOne({
      where: { name: { [Op.iLike]: name } },
    });

    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: `${name} already exists`,
      });
    } else {
      const org = await models.Organizations.create({ name });

      let accType = await models.AccTypeMasters.findOne({
        where: { name: { [Op.iLike]: 'personal' } },
      });
      if (!accType) {
        accType = await models.AccTypeMasters.create({
          name: 'personal',
          goldenRule: 'Debit the receiver, Credit the giver',
        });
      }

      await models.Accounts.create({
        OrgId: org.id,
        UserId: userId,
        AccTypeId: accType.id,
        isAdmin: true,
        isMember: true,
      });
      return res.status(200).json({
        success: true,
        msg: 'Organization created successfully!',
        metaData: req?.meta ?? null,
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, msg: 'Something went wrong, we are looking into it' });
  }
};
