import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'يورو', flag: '🇪🇺' },
  { code: 'USD', symbol: '$', name: 'دولار أمريكي', flag: '🇺🇸' },
  { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي', flag: '🇸🇦' },
  { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي', flag: '🇦🇪' },
  { code: 'KWD', symbol: 'د.ك', name: 'دينار كويتي', flag: '🇰🇼' },
  { code: 'QAR', symbol: 'ر.ق', name: 'ريال قطري', flag: '🇶🇦' },
  { code: 'BHD', symbol: 'د.ب', name: 'دينار بحريني', flag: '🇧🇭' },
  { code: 'OMR', symbol: 'ر.ع', name: 'ريال عماني', flag: '🇴🇲' },
  { code: 'JOD', symbol: 'د.أ', name: 'دينار أردني', flag: '🇯🇴' },
  { code: 'EGP', symbol: '£', name: 'جنيه مصري', flag: '🇪🇬' },
  { code: 'LBP', symbol: 'ل.ل', name: 'ليرة لبنانية', flag: '🇱🇧' },
  { code: 'SYP', symbol: 'ل.س', name: 'ليرة سورية', flag: '🇸🇾' },
  { code: 'IQD', symbol: 'د.ع', name: 'دينار عراقي', flag: '🇮🇶' },
  { code: 'TND', symbol: 'د.ت', name: 'دينار تونسي', flag: '🇹🇳' },
  { code: 'MAD', symbol: 'د.م', name: 'درهم مغربي', flag: '🇲🇦' },
  { code: 'DZD', symbol: 'د.ج', name: 'دينار جزائري', flag: '🇩🇿' },
  { code: 'GBP', symbol: '£', name: 'جنيه إسترليني', flag: '🇬🇧' },
  { code: 'TRY', symbol: '₺', name: 'ليرة تركية', flag: '🇹🇷' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('selectedCurrency');
      if (saved) {
        const parsed = JSON.parse(saved);
        return CURRENCIES.find(c => c.code === parsed.code) || CURRENCIES[0];
      }
      return CURRENCIES[0]; // Default to EUR
    } catch {
      return CURRENCIES[0];
    }
  });

  useEffect(() => {
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const formatAmount = (amount: number): string => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
