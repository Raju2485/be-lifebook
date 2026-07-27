/**
 * Sanitization utilities.
 *
 * CSV injection: Spreadsheet apps (Excel, LibreOffice) interpret cells starting
 * with =, +, -, @, \t, or \r as formulas. OWASP recommends prefixing those
 * values with a single quote so they are treated as plain text.
 */

const CSV_FORMULA_PATTERN = /^[=+\-@\t\r]/;

const sanitizeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value).replace(/\x00/g, '');
  if (CSV_FORMULA_PATTERN.test(str)) {
    return `'${str}`;
  }
  return str;
};

const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/\x00/g, '').trim();
};

const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = sanitizeObject(obj[key]);
  }
  return result;
};

module.exports = { sanitizeCsvValue, sanitizeString, sanitizeObject };
