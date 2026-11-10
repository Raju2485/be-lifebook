export type MonthInput = {
  type: string;
  name: string;
  sequence: number;
};

export type YearInput = {
  name: string;
};

export const getPreviousMonthAndYear = async ({
  month,
  year,
}: {
  month: MonthInput;
  year: YearInput;
}) => {
  try {
    if (!month.type || !year.name) {
      return Promise.reject('month.type || year.name is incorrect');
    }

    let previousMonthNum: number;
    let previousYear: number;

    if (
      (month.type == 'quarters' && month.name.toLowerCase() == '1st quarter') ||
      (month.type == 'quarters' && month.name.toLowerCase() == 'half yearly') ||
      (month.type == 'quarters' && month.name.toLowerCase() == 'yearly') ||
      (month.type == 'months' && month.name.toLowerCase() == 'january')
    ) {
      previousMonthNum = 12;
      previousYear = Number(year.name) - 1;
    } else if (
      month.type == 'quarters' &&
      month.name.toLowerCase() == '2nd quarter'
    ) {
      previousMonthNum = 3;
      previousYear = Number(year.name);
    } else if (
      month.type == 'quarters' &&
      month.name.toLowerCase() == '3rd quarter'
    ) {
      previousMonthNum = 6;
      previousYear = Number(year.name);
    } else if (
      month.type == 'quarters' &&
      month.name.toLowerCase() == '4th quarter'
    ) {
      previousMonthNum = 9;
      previousYear = Number(year.name);
    } else {
      previousMonthNum = month.sequence - 1;
      previousYear = Number(year.name);
    }

    return Promise.resolve({
      previousMonthNum: previousMonthNum,
      previousYear: previousYear,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
