import * as XLSX from 'xlsx';
import { formatINR, formatUSD, formatRate, formatPct, monthKeyToLabel } from './formatters';

export function exportScenarioToExcel(scenarioData, fyLabel, scenarioName) {
  const wb = XLSX.utils.book_new();

  // ─── Sheet 1: Summary ────────────────────────────────────────────────────────
  const summaryRows = [
    [`RupeeShift — ${scenarioName} — ${fyLabel}`],
    [`Generated: ${new Date().toLocaleDateString('en-IN')}`],
    [],
    ['Exchange rates sourced from Frankfurter (ECB reference rates). Figures are indicative.'],
    [],
    ['KEY METRICS'],
    ...scenarioData.summaryRows
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 35 }, { wch: 20 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // ─── Sheet 2: Monthly Breakdown ──────────────────────────────────────────────
  if (scenarioData.monthlyBreakdown) {
    const ws = XLSX.utils.aoa_to_sheet([scenarioData.monthlyHeaders, ...scenarioData.monthlyBreakdown]);
    ws['!cols'] = scenarioData.monthlyHeaders.map(() => ({ wch: 16 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Breakdown');
  }

  // ─── Sheet 3: Increment Scenarios ────────────────────────────────────────────
  if (scenarioData.incrementRows) {
    const ws = XLSX.utils.aoa_to_sheet([scenarioData.incrementHeaders, ...scenarioData.incrementRows]);
    ws['!cols'] = scenarioData.incrementHeaders.map(() => ({ wch: 18 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Increment Scenarios');
  }

  // ─── Sheet 4: Exchange Rates ─────────────────────────────────────────────────
  if (scenarioData.exchangeRates) {
    const rateRows = [['Month', 'Avg Rate (₹/$)'], ...Object.entries(scenarioData.exchangeRates).map(([k, v]) => [monthKeyToLabel(k), parseFloat(v.toFixed(4))])];
    const ws = XLSX.utils.aoa_to_sheet(rateRows);
    ws['!cols'] = [{ wch: 12 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Exchange Rates');
  }

  XLSX.writeFile(wb, `RupeeShift_${scenarioName.replace(/\s+/g, '_')}_${fyLabel.replace(/[–\s]+/g, '_')}.xlsx`);
}

export function exportScenarioToCSV(headers, rows, filename) {
  const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
