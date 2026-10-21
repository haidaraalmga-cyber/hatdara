import { 
  DollarSign, Banknote, Coins, CreditCard, Wallet, PiggyBank,
  Receipt, FileText, Percent, CircleDollarSign,
  TrendingUp, TrendingDown, BarChart, PieChart, LineChart,
  Calendar as CalendarIcon, Clock, ArrowUpCircle, ArrowDownCircle,
  Settings as SettingsIcon, Target, Activity,
  Repeat, ArrowLeftRight, ArrowRightLeft, Calculator,
  BadgeDollarSign, Landmark
} from 'lucide-react';

interface PageBackgroundProps {
  page: string;
}

const PageBackground = ({ page }: PageBackgroundProps) => {
  // Define icon sets for each page - ALL FINANCIAL THEMED
  const pageIcons: Record<string, any[]> = {
    dashboard: [
      DollarSign, Banknote, Coins, CreditCard, Wallet, PiggyBank,
      TrendingUp, TrendingDown, BarChart, PieChart, LineChart,
      CircleDollarSign, BadgeDollarSign, Target, Activity, Landmark
    ],
    transactions: [
      DollarSign, Banknote, Receipt, Coins, CreditCard, Wallet,
      ArrowUpCircle, ArrowDownCircle, CircleDollarSign, BadgeDollarSign,
      FileText, Percent, Calculator, PiggyBank
    ],
    recurring: [
      Repeat, ArrowLeftRight, ArrowRightLeft, Clock, CalendarIcon,
      DollarSign, Coins, Receipt, Banknote, CreditCard,
      CircleDollarSign, PiggyBank, Wallet, BadgeDollarSign
    ],
    calendar: [
      CalendarIcon, Clock, DollarSign, Coins, Receipt,
      TrendingUp, Banknote, CreditCard, Wallet,
      ArrowUpCircle, CircleDollarSign, Target, BadgeDollarSign
    ],
    report: [
      BarChart, PieChart, LineChart, Activity,
      TrendingUp, TrendingDown, DollarSign, Coins, Banknote,
      Target, Percent, BadgeDollarSign, CircleDollarSign, CreditCard
    ],
    settings: [
      SettingsIcon, Target, DollarSign, Wallet, PiggyBank,
      Coins, Banknote, CreditCard, CircleDollarSign,
      BadgeDollarSign, Landmark, Calculator
    ]
  };

  const icons = pageIcons[page] || pageIcons.dashboard;

  // Generate random positions for icons
  const generatePositions = () => {
    const positions = [];
    const count = 25; // عدد الأيقونات في الخلفية
    
    for (let i = 0; i < count; i++) {
      positions.push({
        Icon: icons[Math.floor(Math.random() * icons.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 30 + Math.random() * 40, // من 30 إلى 70 (أكبر)
        opacity: 0.08 + Math.random() * 0.12, // من 0.08 إلى 0.20 (أوضح)
        rotation: Math.random() * 360,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10 // 15-25 ثانية
      });
    }
    return positions;
  };

  const iconPositions = generatePositions();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {iconPositions.map((pos, index) => {
        const Icon = pos.Icon;
        return (
          <div
            key={index}
            className="absolute"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              animation: `float-up ${pos.duration}s linear infinite`,
              animationDelay: `${pos.delay}s`,
              '--rotation': `${pos.rotation}deg`,
              '--opacity': pos.opacity
            } as React.CSSProperties}
          >
            <Icon 
              size={pos.size} 
              className="text-gray-500 dark:text-gray-500"
              strokeWidth={1.5}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PageBackground;
