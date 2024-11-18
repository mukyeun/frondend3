export const SORT_OPTIONS = {
  DATE_DESC: 'date_desc',
  DATE_ASC: 'date_asc',
  BMI_DESC: 'bmi_desc'
};

export const sortData = (data, sortOption) => {
  const sortedData = [...data];
  
  switch (sortOption) {
    case SORT_OPTIONS.DATE_ASC:
      return sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    case SORT_OPTIONS.DATE_DESC:
      return sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    case SORT_OPTIONS.BMI_DESC:
      return sortedData.sort((a, b) => b.bmi - a.bmi);
    default:
      return sortedData;
  }
};

export const filterDataByDateRange = (data, startDate, endDate) => {
  if (!startDate && !endDate) return data;
  
  return data.filter(item => {
    const itemDate = new Date(item.date);
    const isAfterStart = !startDate || itemDate >= new Date(startDate);
    const isBeforeEnd = !endDate || itemDate <= new Date(endDate);
    return isAfterStart && isBeforeEnd;
  });
};

export const filterDataByBMIRange = (data, minBMI, maxBMI) => {
  if (!minBMI && !maxBMI) return data;
  
  return data.filter(item => {
    const isAboveMin = !minBMI || item.bmi >= minBMI;
    const isBelowMax = !maxBMI || item.bmi <= maxBMI;
    return isAboveMin && isBelowMax;
  });
};
