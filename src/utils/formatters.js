import { INDIAN_LAKH, INDIAN_CRORE } from '../data/fyConfig';

// Indian number formatting (lakhs and crores)
export function formatINR(value, options = {}) {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  const { compact = false, showSymbol = true } = options;
  const symbol = showSymbol ? '₹' : '';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (compact) {
    if (absValue >= INDIAN_CRORE) return `${sign}${symbol}${(absValue / INDIAN_CRORE).toFixed(2)} Cr`;
    if (absValue >= INDIAN_LAKH) return `${sign}${symbol}${(absValue / INDIAN_LAKH).toFixed(2)} L`;
    if (absValue >= 1000) return `${sign}${symbol}${(absValue / 1000).toFixed(1)}K`;
  }
  return `${sign}${symbol}${absValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

// USD formatting
export function formatUSD(value, options = {}) {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  const { compact = false, decimals = 2 } = options;
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (compact) {
    if (absValue >= 1_000_000) return `${sign}$${(absValue / 1_000_000).toFixed(2)}M`;
    if (absValue >= 1_000) return `${sign}$${(absValue / 1_000).toFixed(1)}K`;
  }
  return `${sign}$${absValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

// Rate formatting
export function formatRate(value) {
  if (value === null || value === undefined || isNaN(value)) return '₹0.00/$';
  return `₹${Number(value).toFixed(2)}/$`;
}

// Percentage
export function formatPct(value, { showSign = false, decimals = 2 } = {}) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(decimals)}%`;
}

// Short month name from YYYY-MM key
export function monthKeyToLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
}

// Short month abbreviation
export function monthKeyToShort(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleString('en-IN', { month: 'short' });
}
