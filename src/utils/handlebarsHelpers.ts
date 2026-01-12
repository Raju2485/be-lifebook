// File: helpers/handlebarsHelpers.js
import Handlebars from 'handlebars';
import fse from 'fs-extra';
import path from 'path';

// Register math helper for calculations in templates
Handlebars.registerHelper('math', function(lvalue, divisor) {
    return Math.round((lvalue / divisor) * 100) / 100;
});

// Register increment helper for step numbers
Handlebars.registerHelper('inc', function(value) {
    return parseInt(value) + 1;
});

// Register comparison helper
Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});

// Register formatting helper for numbers
Handlebars.registerHelper('formatNumber', function(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

export const compile = async (templateName, data) => {
  const filePath = path.join(
    process.cwd(),
    'src',
    'templates',
    `${templateName}.hbs`
  );
  const html = await fse.readFile(filePath, 'utf-8');
  return Handlebars.compile(html)(data);
};

// module.exports = Handlebars;