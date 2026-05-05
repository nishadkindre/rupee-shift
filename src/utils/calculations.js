import { getFYMonthKeys } from './rateHelpers';
import { MONTHS_IN_FY } from '../data/fyConfig';

// ─── Scenario 1: Indian Subsidiary ───────────────────────────────────────────

export function calcSubsidiary({ annualINR, customMonthly, monthlyAverages, fyStartRate, fyEndRate, nextFYRate, fyConfig }) {
  const monthKeys = getFYMonthKeys(fyConfig);
  const equalMonthly = annualINR / MONTHS_IN_FY;

  const monthlyData = monthKeys.map((key, i) => {
    const rate = monthlyAverages[key] || fyStartRate;
    const monthINR = customMonthly ? customMonthly[i] || equalMonthly : equalMonthly;
    const monthlyUSD = monthINR / rate;
    const baselineUSD = monthINR / fyStartRate;
    const saving = baselineUSD - monthlyUSD;
    return {
      monthKey: key,
      rate,
      monthINR,
      monthlyUSD,
      baselineUSD,
      saving,
      savingINR: saving * fyStartRate
    };
  });

  // Running cumulative
  let cumulative = 0;
  monthlyData.forEach(row => {
    cumulative += row.monthlyUSD;
    row.cumulativeUSD = cumulative;
  });

  const totalActualUSD = monthlyData.reduce((s, r) => s + r.monthlyUSD, 0);
  const totalBaselineUSD = monthlyData.reduce((s, r) => s + r.baselineUSD, 0);
  const totalUSDSaved = totalBaselineUSD - totalActualUSD;
  const totalINREquivSaved = totalUSDSaved * fyStartRate;
  const fyAppreciationPct = ((fyEndRate - fyStartRate) / fyStartRate) * 100;
  const breakEvenPct = ((nextFYRate - fyStartRate) / fyStartRate) * 100;

  return {
    monthlyData,
    totalActualUSD,
    totalBaselineUSD,
    totalUSDSaved,
    totalINREquivSaved,
    fyAppreciationPct,
    breakEvenPct
  };
}

export function calcSubsidiaryIncrement({ annualINR, nextFYRate, fyStartRate, incrementPct }) {
  const newAnnualINR = annualINR * (1 + incrementPct / 100);
  const newAnnualUSD = newAnnualINR / nextFYRate;
  const baselineUSD = annualINR / fyStartRate;
  const usdDiff = newAnnualUSD - baselineUSD;
  const usdDiffPct = (usdDiff / baselineUSD) * 100;
  return { newAnnualINR, newAnnualUSD, baselineUSD, usdDiff, usdDiffPct };
}

export function calcSubsidiaryIncrementTable({ annualINR, nextFYRate, fyStartRate, breakEvenPct }) {
  const rows = [0, 5, 10, parseFloat(breakEvenPct.toFixed(2)), 12, 15, 18, 20, 25, 30];
  const unique = [...new Set(rows.map(r => parseFloat(r.toFixed(2))))].sort((a, b) => a - b);
  return unique.map(pct => {
    const result = calcSubsidiaryIncrement({
      annualINR,
      nextFYRate,
      fyStartRate,
      incrementPct: pct
    });
    const isBreakEven = Math.abs(pct - parseFloat(breakEvenPct.toFixed(2))) < 0.1;
    let verdict;
    if (result.usdDiff < -10) verdict = 'savings';
    else if (Math.abs(result.usdDiff) <= 10 || isBreakEven) verdict = 'breakeven';
    else verdict = 'costlier';
    return { pct, ...result, verdict, isBreakEven };
  });
}

// ─── Scenario 2: IT Exporter ─────────────────────────────────────────────────

export function calcITExporter({ annualUSD, annualINRCost, monthlyAverages, fyStartRate, fyEndRate, nextFYRate, fyConfig }) {
  const monthKeys = getFYMonthKeys(fyConfig);
  const monthlyUSD = annualUSD / MONTHS_IN_FY;
  const baselineAnnualINR = annualUSD * fyStartRate;

  const monthlyData = monthKeys.map(key => {
    const rate = monthlyAverages[key] || fyStartRate;
    const inrRealised = monthlyUSD * rate;
    const baselineINR = monthlyUSD * fyStartRate;
    const fxGain = inrRealised - baselineINR;
    return {
      monthKey: key,
      rate,
      monthlyUSD,
      inrRealised,
      baselineINR,
      fxGain
    };
  });

  let cumulative = 0;
  monthlyData.forEach(row => {
    cumulative += row.fxGain;
    row.cumulativeGain = cumulative;
  });

  const actualAnnualINR = monthlyData.reduce((s, r) => s + r.inrRealised, 0);
  const fxGainINR = actualAnnualINR - baselineAnnualINR;
  const fxGainPct = (fxGainINR / baselineAnnualINR) * 100;
  const fyAppreciationPct = ((fyEndRate - fyStartRate) / fyStartRate) * 100;
  const breakEvenPct = ((nextFYRate - fyStartRate) / fyStartRate) * 100;

  // Flat renewal at next FY rate
  const flatRenewalINR = annualUSD * nextFYRate;
  const flatRenewalGain = flatRenewalINR - baselineAnnualINR;
  const flatRenewalGainPct = (flatRenewalGain / baselineAnnualINR) * 100;

  return {
    monthlyData,
    actualAnnualINR,
    baselineAnnualINR,
    fxGainINR,
    fxGainPct,
    fyAppreciationPct,
    breakEvenPct,
    flatRenewalINR,
    flatRenewalGain,
    flatRenewalGainPct
  };
}

export function calcITExporterHike({ annualINRCost, fxGainINR, hikePct }) {
  const hikeCostINR = annualINRCost * (hikePct / 100);
  const fxFundedPortion = hikeCostINR > 0 ? Math.min(100, (fxGainINR / hikeCostINR) * 100) : 100;
  const netMarginImpact = fxGainINR - hikeCostINR;
  return { hikeCostINR, fxFundedPortion, netMarginImpact };
}

export function calcITExporterHikeTable({ annualINRCost, fxGainINR }) {
  const rows = [0, 5, 10, 12, 15, 18, 20, 25, 30];
  return rows.map(pct => {
    const result = calcITExporterHike({
      annualINRCost,
      fxGainINR,
      hikePct: pct
    });
    let verdict;
    if (result.netMarginImpact > 0) verdict = 'gain';
    else if (Math.abs(result.netMarginImpact) < annualINRCost * 0.005) verdict = 'breakeven';
    else verdict = 'loss';
    return { pct, ...result, verdict };
  });
}

export function calcContractRenewalTable({ annualUSD, fyStartRate, nextFYRate, baselineAnnualINR }) {
  const changes = [-10, -5, 0, 5, 10, 15, 20];
  return changes.map(changePct => {
    const newUSD = annualUSD * (1 + changePct / 100);
    const inrAtNextFY = newUSD * nextFYRate;
    const vsBaseline = inrAtNextFY - baselineAnnualINR;
    const effectiveGrowth = (vsBaseline / baselineAnnualINR) * 100;
    return { changePct, newUSD, inrAtNextFY, vsBaseline, effectiveGrowth };
  });
}

// ─── Scenario 3: Freelancer ──────────────────────────────────────────────────

export function calcFreelancer({ monthlyUSD, monthlyAverages, fyStartRate, fyEndRate, fyConfig }) {
  const monthKeys = getFYMonthKeys(fyConfig);
  const baselineAnnualINR = monthlyUSD * MONTHS_IN_FY * fyStartRate;

  const monthlyData = monthKeys.map(key => {
    const rate = monthlyAverages[key] || fyStartRate;
    const inrReceived = monthlyUSD * rate;
    const baselineINR = monthlyUSD * fyStartRate;
    const uplift = inrReceived - baselineINR;
    return {
      monthKey: key,
      rate,
      monthlyUSD,
      inrReceived,
      baselineINR,
      uplift
    };
  });

  let cumulative = 0;
  monthlyData.forEach(row => {
    cumulative += row.uplift;
    row.cumulativeUplift = cumulative;
  });

  const actualAnnualINR = monthlyData.reduce((s, r) => s + r.inrReceived, 0);
  const annualFXUplift = actualAnnualINR - baselineAnnualINR;
  const holdAndConvertINR = monthlyUSD * MONTHS_IN_FY * fyEndRate;
  const holdUplift = holdAndConvertINR - baselineAnnualINR;
  const fyAppreciationPct = ((fyEndRate - fyStartRate) / fyStartRate) * 100;

  return {
    monthlyData,
    actualAnnualINR,
    baselineAnnualINR,
    annualFXUplift,
    holdAndConvertINR,
    holdUplift,
    fyAppreciationPct
  };
}

export function calcFreelancerRateCard({ monthlyUSD, fyStartRate, nextFYRate, increasePct }) {
  const newMonthlyUSD = monthlyUSD * (1 + increasePct / 100);
  const newAnnualINR = newMonthlyUSD * MONTHS_IN_FY * nextFYRate;
  const baselineAnnualINR = monthlyUSD * MONTHS_IN_FY * fyStartRate;
  const effectiveINRGrowth = ((newAnnualINR - baselineAnnualINR) / baselineAnnualINR) * 100;
  const reversionAnnualINR = newMonthlyUSD * MONTHS_IN_FY * fyStartRate;
  const reversionLoss = newAnnualINR - reversionAnnualINR;
  return {
    newMonthlyUSD,
    newAnnualINR,
    effectiveINRGrowth,
    reversionAnnualINR,
    reversionLoss,
    baselineAnnualINR
  };
}

export function calcFreelancerRateCardTable({ monthlyUSD, fyStartRate, nextFYRate }) {
  const rows = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  return rows.map(pct =>
    calcFreelancerRateCard({
      monthlyUSD,
      fyStartRate,
      nextFYRate,
      increasePct: pct
    })
  );
}

// ─── Scenario 4: INR Employee ─────────────────────────────────────────────────

export function calcINREmployee({ monthlyINR, billingRate, monthlyAverages, fyStartRate, fyEndRate, nextFYRate, fyConfig }) {
  const monthKeys = getFYMonthKeys(fyConfig);
  const fyStartUSDSalary = monthlyINR / fyStartRate;

  const monthlyData = monthKeys.map(key => {
    const rate = monthlyAverages[key] || fyStartRate;
    const usdValue = monthlyINR / rate;
    const erosion = fyStartUSDSalary - usdValue;
    return {
      monthKey: key,
      rate,
      monthlyINR,
      usdValue,
      baselineUSD: fyStartUSDSalary,
      erosion
    };
  });

  let cumErosion = 0;
  monthlyData.forEach(row => {
    cumErosion += row.erosion;
    row.cumulativeErosion = cumErosion;
  });

  const annualUSDLoss = monthlyData.reduce((s, r) => s + r.erosion, 0);
  const marchUSDValue = monthlyData[monthlyData.length - 1]?.usdValue || fyStartUSDSalary;
  const breakEvenPct = ((nextFYRate - fyStartRate) / fyStartRate) * 100;
  const fyAppreciationPct = ((fyEndRate - fyStartRate) / fyStartRate) * 100;

  // Pass-through analysis (if billing rate provided)
  let passThroughData = null;
  if (billingRate && billingRate > 0) {
    const companyFXGainMonthly = billingRate * (nextFYRate - fyStartRate);
    const companyFXGainAnnual = companyFXGainMonthly * MONTHS_IN_FY;
    const breakEvenCostToCompany = monthlyINR * (breakEvenPct / 100) * MONTHS_IN_FY;
    passThroughData = {
      billingRate,
      companyFXGainMonthly,
      companyFXGainAnnual,
      breakEvenCostToCompany,
      passThroughRatio: breakEvenPct > 0 ? (breakEvenCostToCompany / companyFXGainAnnual) * 100 : 0
    };
  }

  return {
    monthlyData,
    annualUSDLoss,
    marchUSDValue,
    fyStartUSDSalary,
    breakEvenPct,
    fyAppreciationPct,
    passThroughData
  };
}

export function calcINREmployeeIncrement({ monthlyINR, fyStartRate, nextFYRate, incrementPct }) {
  const newMonthlyINR = monthlyINR * (1 + incrementPct / 100);
  const newUSDValue = newMonthlyINR / nextFYRate;
  const fyStartUSDSalary = monthlyINR / fyStartRate;
  const realUSDChange = newUSDValue - fyStartUSDSalary;
  const realUSDChangePct = (realUSDChange / fyStartUSDSalary) * 100;
  return {
    newMonthlyINR,
    newUSDValue,
    fyStartUSDSalary,
    realUSDChange,
    realUSDChangePct
  };
}

export function calcINREmployeeIncrementTable({ monthlyINR, fyStartRate, nextFYRate, breakEvenPct }) {
  const rows = [0, 2, 5, 8, 10, parseFloat(breakEvenPct.toFixed(2)), 12, 15, 18, 20, 25, 30];
  const unique = [...new Set(rows.map(r => parseFloat(r.toFixed(2))))].sort((a, b) => a - b);
  return unique.map(pct => {
    const result = calcINREmployeeIncrement({
      monthlyINR,
      fyStartRate,
      nextFYRate,
      incrementPct: pct
    });
    const isBreakEven = Math.abs(pct - parseFloat(breakEvenPct.toFixed(2))) < 0.1;
    let verdict;
    if (result.realUSDChange > 0.01) verdict = 'raise';
    else if (result.realUSDChange < -0.01 && !isBreakEven) verdict = 'paycut';
    else verdict = 'breakeven';
    return { pct, ...result, verdict, isBreakEven };
  });
}
