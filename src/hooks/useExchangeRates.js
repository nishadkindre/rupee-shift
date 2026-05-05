import { useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { FY_CONFIG } from '../data/fyConfig';
import { computeMonthlyAverages, getFYStartRate, getFYEndRate } from '../utils/rateHelpers';

export function useExchangeRates(fyKey) {
  const { dispatch } = useAppContext();

  const fetchRates = useCallback(async () => {
    if (!fyKey || !FY_CONFIG[fyKey]) return;

    const CACHE_KEY = `rupeeshift_rates_${fyKey}`;
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        dispatch({ type: 'SET_RATES_SUCCESS', payload: parsed });
        return;
      } catch {
        // Cache corrupt, re-fetch
      }
    }

    dispatch({ type: 'SET_RATES_LOADING' });
    const fyConfig = FY_CONFIG[fyKey];

    try {
      const url = `https://api.frankfurter.dev/v1/${fyConfig.startDate}..${fyConfig.endDate}?base=USD&symbols=INR`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Parse daily rates: { 'YYYY-MM-DD': rate }
      const dailyRates = {};
      for (const [date, currencies] of Object.entries(data.rates || {})) {
        if (currencies.INR) dailyRates[date] = currencies.INR;
      }

      const monthlyAverages = computeMonthlyAverages(dailyRates);
      const fyStartRate = getFYStartRate(dailyRates, fyConfig) || fyConfig.nextYearStartRate;
      const fyEndRate = getFYEndRate(dailyRates, fyConfig) || fyConfig.nextYearStartRate;

      const result = { dailyRates, monthlyAverages, fyStartRate, fyEndRate };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
      dispatch({ type: 'SET_RATES_SUCCESS', payload: result });
    } catch (err) {
      // Use fallback data
      const fallbackRates = fyConfig.fallbackRates || {};
      const fyStartRate = Object.values(fallbackRates)[0] || 83.0;
      const fyEndRateArr = Object.values(fallbackRates);
      const fyEndRate = fyEndRateArr[fyEndRateArr.length - 1] || fyStartRate;
      dispatch({
        type: 'SET_RATES_SUCCESS',
        payload: {
          dailyRates: {},
          monthlyAverages: fallbackRates,
          fyStartRate,
          fyEndRate
        }
      });
      dispatch({ type: 'SET_RATES_ERROR', payload: err.message });
    }
  }, [fyKey, dispatch]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return { refetch: fetchRates };
}
