import { useCurrency } from '../context/CurrencyContext';

interface CurrencyAmountProps {
  amount: number;
  className?: string;
}

const CurrencyAmount = ({ amount, className = '' }: CurrencyAmountProps) => {
  const { currency } = useCurrency();
  
  return (
    <span className={className}>
      {currency.symbol}{amount.toFixed(2)}
    </span>
  );
};

export default CurrencyAmount;
