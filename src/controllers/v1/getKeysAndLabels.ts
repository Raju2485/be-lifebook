import { Request, Response } from 'express';
import models from '../../models/index';
import { Op, where } from 'sequelize';
import { getLimitAndOffset, getNewPagination } from '../../utils/newPagination';
import { monthNumberToName } from '../../utils/monthConversion';
import { toTitleCase } from '../../utils/toTitleCase';

export const getKeysAndLabels = async (req: Request, res: Response) => {
  try {
    let { apiEndpoint } = req.query;
    apiEndpoint = String(apiEndpoint);
    if (!apiEndpoint) {
      return res.status(400).json({
        success: false,
        msg: 'API Endpoint is required',
      });
    }
    const keyAndLabel = await models.KeysAndLabels.findOne({
      where: { apiEndpoint },
      attributes: ['id', 'json'],
    });

    return res.status(200).json({
      success: true,
      data: keyAndLabel ? keyAndLabel.json : null,
      metaData: req?.meta ?? null,
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
