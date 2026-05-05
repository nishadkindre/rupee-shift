import { createContext, useContext, useReducer } from 'react';
import { DEFAULT_FY } from '../data/fyConfig';

const AppContext = createContext(null);

const initialState = {
  selectedFY: DEFAULT_FY,
  activeScenario: 'subsidiary',
  ratesData: {
    dailyRates: {},
    monthlyAverages: {},
    fyStartRate: null,
    fyEndRate: null,
    loading: false,
    error: null
  },
  subsidiaryParams: {
    annualINR: 40_232_000,
    expenseType: 'equal',
    customMonthly: null,
    nextFYRate: null,
    incrementPct: 10
  },
  itExporterParams: {
    annualUSD: 1_000_000,
    annualINRCost: 40_232_000,
    revenueType: 'equal',
    nextFYRate: null,
    hikePct: 12
  },
  freelancerParams: {
    monthlyUSD: 5_000,
    conversionTiming: 'same_month',
    nextFYRate: null,
    rateIncreasePct: 10
  },
  inrEmployeeParams: {
    monthlyINR: 85_600,
    billingRate: '',
    nextFYRate: null,
    incrementPct: 12
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FY':
      return { ...state, selectedFY: action.payload };
    case 'SET_SCENARIO':
      return { ...state, activeScenario: action.payload };
    case 'SET_RATES_LOADING':
      return {
        ...state,
        ratesData: { ...state.ratesData, loading: true, error: null }
      };
    case 'SET_RATES_SUCCESS':
      return {
        ...state,
        ratesData: { ...action.payload, loading: false, error: null }
      };
    case 'SET_RATES_ERROR':
      return {
        ...state,
        ratesData: {
          ...state.ratesData,
          loading: false,
          error: action.payload
        }
      };
    case 'UPDATE_SUBSIDIARY_PARAMS':
      return {
        ...state,
        subsidiaryParams: { ...state.subsidiaryParams, ...action.payload }
      };
    case 'UPDATE_IT_EXPORTER_PARAMS':
      return {
        ...state,
        itExporterParams: { ...state.itExporterParams, ...action.payload }
      };
    case 'UPDATE_FREELANCER_PARAMS':
      return {
        ...state,
        freelancerParams: { ...state.freelancerParams, ...action.payload }
      };
    case 'UPDATE_INR_EMPLOYEE_PARAMS':
      return {
        ...state,
        inrEmployeeParams: { ...state.inrEmployeeParams, ...action.payload }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
