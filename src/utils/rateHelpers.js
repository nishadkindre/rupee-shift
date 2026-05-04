// Compute monthly averages from daily rates object
export function computeMonthlyAverages(dailyRates) {
  // dailyRates: { '2024-04-01': 83.41, '2024-04-02': 83.44, ... }
  // Returns: { '2024-04': 83.52, '2024-05': 83.71, ... }
  const monthMap = {};
  for (const [dateStr, rate] of Object.entries(dailyRates)) {
    const monthKey = dateStr.slice(0, 7); // 'YYYY-MM'
    if (!monthMap[monthKey]) monthMap[monthKey] = [];
    monthMap[monthKey].push(rate);
  }
  const averages = {};
  for (const [month, rates] of Object.entries(monthMap)) {
    averages[month] = rates.reduce((a, b) => a + b, 0) / rates.length;
  }
  return averages;
}

// Get ordered monthly keys for an FY (Apr YYYY - Mar YYYY+1)
export function getFYMonthKeys(fyConfig) {
  const startYear = parseInt(fyConfig.startDate.slice(0, 4));
  const keys = [];
  for (let m = 4; m <= 12; m++) {
    keys.push(`${startYear}-${String(m).padStart(2, '0')}`);
  }
  for (let m = 1; m <= 3; m++) {
    keys.push(`${startYear + 1}-${String(m).padStart(2, '0')}`);
  }
  return keys;
}

// Get FY start rate: first available rate in April
export function getFYStartRate(dailyRates, fyConfig) {
  const startYear = fyConfig.startDate.slice(0, 4);
  const aprilKeys = Object.keys(dailyRates)
    .filter(d => d.startsWith(`${startYear}-04`))
    .sort();
  if (aprilKeys.length > 0) return dailyRates[aprilKeys[0]];
  return null;
}

// Get FY end rate: last available rate in March
export function getFYEndRate(dailyRates, fyConfig) {
  const endYear = fyConfig.endDate.slice(0, 4);
  const marchKeys = Object.keys(dailyRates)
    .filter(d => d.startsWith(`${endYear}-03`))
    .sort();
  if (marchKeys.length > 0) return dailyRates[marchKeys[marchKeys.length - 1]];
  return null;
}
