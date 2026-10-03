import { Request, Response } from 'express';
import { addDscSignatureFields } from '../../utils/addDscSignatureFields';

const pdfMake = require('pdfmake');

pdfMake.setFonts(require('pdfmake/fonts/Roboto'));
pdfMake.setUrlAccessPolicy(() => false);
pdfMake.setLocalAccessPolicy(() => true);

const pdfMakeTest = async (req: Request, res: Response): Promise<void> => {
  try {
    let { json } = req.body;

    if (!json) {
      res.status(400).json({
        success: false,
        msg: 'json is required',
      });
      return;
    }

    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    var docDefinition = {
      pageMargins: [40, 40, 40, 160],
      content: [
        { text: 'This is a header', style: 'header' },
        'No styling here, this is a standard paragraph',
        { text: 'Another text', style: 'anotherStyle' },
        { text: 'Multiple styles applied', style: ['header', 'anotherStyle'] },
      ],

      styles: {
        header: {
          fontSize: 22,
          bold: true,
        },
        anotherStyle: {
          italics: true,
          alignment: 'right',
        },
        subheader: {
          fontSize: 15,
          extends: 'header', // or array of strings
        },
      },
    };
    const pdf = pdfMake.createPdf(docDefinition);
    const unsignedBuffer = await pdf.getBuffer();
    const buffer = await addDscSignatureFields(unsignedBuffer);

    res.set('Content-Disposition', `attachment; filename="document.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (err: any) {
    if (res.headersSent) {
      return;
    }
    console.log(err);
    res.status(500).json({
      success: false,
      msg: 'Something went wrong, we are looking into it',
      error: err.message,
    });
  }
};

export { pdfMakeTest };
