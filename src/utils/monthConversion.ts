const monthsNumbers = {
  january: 1,
  february: 2,
  march: 3,
  first_quarter: 3.1,
  april: 4,
  may: 5,
  june: 6,
  second_quarter: 6.1,
  half_yearly: 6.2,
  july: 7,
  august: 8,
  september: 9,
  third_quarter: 9.1,
  october: 10,
  november: 11,
  december: 12,
  fourth_quarter: 12.1,
  yearly: 12.2,
};

const monthsNames = {
  '1': 'january',
  '2': 'february',
  '3': 'march',
  '3.1': 'first_quarter',
  '4': 'april',
  '5': 'may',
  '6': 'june',
  '6.1': 'second_quarter',
  '6.2': 'half_yearly',
  '7': 'july',
  '8': 'august',
  '9': 'september',
  '9.1': 'third_quarter',
  '10': 'october',
  '11': 'november',
  '12': 'december',
  '12.1': 'fourth_quarter',
  '12.2': 'yearly',
};

export const monthNameToNumber = (monthName) => {
  return monthsNumbers[monthName.toLowerCase()];
};

export const monthNumberToName = (monthNumber) => {
  return monthsNames[String(monthNumber)];
};
