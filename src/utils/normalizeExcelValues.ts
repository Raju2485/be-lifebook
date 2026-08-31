export const normalizeExcelValues = (values: any) => {

    const normalizedValues = values.map((value: any) => {
      if (value && typeof value === 'object' && value.richText) {
        return value.richText.map((rt: any) => rt.text).join('');
      } else if (value && typeof value === 'object' && value.text) {
        return value?.text;
      } else if (value && typeof value === 'object' && value.result) {
        return value?.result;
      }
      return value;
    });

    return normalizedValues;
}