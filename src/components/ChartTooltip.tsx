import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';

interface ChartTooltipProps {
  show: boolean;
  x: number;
  y: number;
  data: {
    label: string;
    value: number;
    color?: string;
    icon?: string;
  };
}

const ChartTooltip = ({ show, x, y, data }: ChartTooltipProps) => {
  const { formatAmount } = useCurrency();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.15 }}
        >
          <div className="glass-card p-3 rounded-xl shadow-premium-lg min-w-[150px]">
            <div className="flex items-center gap-2 mb-1">
              {data.icon && <span className="text-xl">{data.icon}</span>}
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {data.label}
              </p>
            </div>
            <p 
              className="text-lg font-bold"
              style={{ color: data.color || 'var(--accent-primary)' }}
            >
              {formatAmount(data.value)}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChartTooltip;
