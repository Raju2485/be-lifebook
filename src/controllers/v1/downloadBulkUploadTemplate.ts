import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const downloadBulkUploadTemplate = async (
  req: Request,
  res: Response
) => {
  try {
    const filePath = path.join(process.cwd(), 'import_template.xlsx');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        msg: 'Template file not found',
      });
    }

    return res.download(filePath, 'import_template.xlsx');
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
