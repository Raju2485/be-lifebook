import {
  PDFDocument,
  PDFName,
  PDFPage,
  PDFString,
  StandardFonts,
  rgb,
} from 'pdf-lib';

type SignatureFieldSpec = {
  name: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const addSignatureWidget = (
  pdfDoc: PDFDocument,
  page: PDFPage,
  field: SignatureFieldSpec
) => {
  const widget = pdfDoc.context.obj({
    Type: 'Annot',
    Subtype: 'Widget',
    FT: 'Sig',
    T: PDFString.of(field.name),
    F: 4,
    P: page.ref,
    Rect: [field.x, field.y, field.x + field.width, field.y + field.height],
    MK: {
      BC: [0, 0, 0],
      BG: [0.95, 0.95, 0.95],
    },
  });
  const widgetRef = pdfDoc.context.register(widget);

  page.node.addAnnot(widgetRef);
  pdfDoc.getForm().acroForm.addField(widgetRef);
};

export const addDscSignatureFields = async (
  pdfBytes: Buffer | Uint8Array
): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const page = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  const { width } = page.getSize();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fieldWidth = 200;
  const fieldHeight = 50;
  const y = 90;
  const fields: SignatureFieldSpec[] = [
    {
      name: 'PreparedBySignature',
      label: 'Prepared by',
      x: 40,
      y,
      width: fieldWidth,
      height: fieldHeight,
    },
    {
      name: 'ApprovedBySignature',
      label: 'Approved by',
      x: width / 2 + 20,
      y,
      width: fieldWidth,
      height: fieldHeight,
    },
  ];

  for (const field of fields) {
    page.drawText(field.label, {
      x: field.x,
      y: field.y - 14,
      size: 10,
      font: fontBold,
    });
    page.drawText('Click to sign with DSC', {
      x: field.x,
      y: field.y - 26,
      size: 8,
      font: fontRegular,
      color: rgb(0.33, 0.33, 0.33),
    });
    addSignatureWidget(pdfDoc, page, field);
  }

  form.acroForm.dict.set(PDFName.of('SigFlags'), pdfDoc.context.obj(3));

  const bytes = await pdfDoc.save({
    useObjectStreams: false,
    updateFieldAppearances: false,
  });

  return Buffer.from(bytes);
};
