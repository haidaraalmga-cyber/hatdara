import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Receipt, Calendar, BarChart3, Settings, 
  Menu, X, Wallet, Target, TrendingUp, CreditCard
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import PageBackground from './PageBackground';
import NotificationCenter from './NotificationCenter';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'لوحة التحكم', 
      icon: <LayoutDashboard className="w-5 h-5" />,
      glowColor: 'from-blue-400 to-indigo-500'
    },
    { 
      id: 'transactions', 
      label: 'العمليات', 
      icon: <Receipt className="w-5 h-5" />,
      glowColor: 'from-emerald-400 to-teal-500'
    },
    { 
      id: 'recurring', 
      label: 'الالتزامات الشهرية', 
      icon: <CreditCard className="w-5 h-5" />,
      glowColor: 'from-violet-400 to-purple-500'
    },
    { 
      id: 'monthlygoal', 
      label: 'أهداف الشهر', 
      icon: <Target className="w-5 h-5" />,
      glowColor: 'from-pink-400 to-rose-500'
    },
    { 
      id: 'comparison', 
      label: 'مقارنة الأشهر', 
      icon: <TrendingUp className="w-5 h-5" />,
      glowColor: 'from-cyan-400 to-blue-500'
    },
    { 
      id: 'calendar', 
      label: 'التقويم', 
      icon: <Calendar className="w-5 h-5" />,
      glowColor: 'from-cyan-400 to-sky-500'
    },
    { 
      id: 'report', 
      label: 'التقرير الشهري', 
      icon: <BarChart3 className="w-5 h-5" />,
      glowColor: 'from-amber-400 to-orange-500'
    },
    { 
      id: 'settings', 
      label: 'الإعدادات', 
      icon: <Settings className="w-5 h-5" />,
      glowColor: 'from-slate-400 to-gray-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950 transition-all duration-500">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-emerald-200/50 dark:border-emerald-800/30 transition-all duration-300 shadow-lg shadow-emerald-100/20 dark:shadow-emerald-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Wallet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <div className="absolute inset-0 blur-xl bg-emerald-400 opacity-30 animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">ميزانيتي</span>
            </div>

            {/* Desktop Navigation - Icons Only */}
            <div className="hidden md:flex items-center gap-3">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative group p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-800/50'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  title={item.label}
                >
                  <span className="relative z-10">
                    {item.icon}
                  </span>
                  
                  {/* Simple elegant glow underneath - no movement */}
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.glowColor} opacity-0 blur-md group-hover:opacity-20 transition-opacity duration-500`}
                  />
                  
                  {/* Subtle bottom glow bar on active - no animation */}
                  {currentPage === item.id && (
                    <div
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-gradient-to-r ${item.glowColor}`}
                    />
                  )}
                  
                  {/* Simple Tooltip - no animation */}
                  <div
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg"
                  >
                    {item.label}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
                  </div>
                </motion.button>
              ))}
              
              {/* Notification Center */}
              <NotificationCenter />
              
              {/* Theme Toggle - Last Item */}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-emerald-200/50 dark:border-emerald-800/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl transition-colors"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`relative w-full px-4 py-3 rounded-xl flex items-center gap-3 text-right group transition-all ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.icon}
                  {item.label}
                  
                  {/* Simple mobile glow effect - no movement */}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.glowColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Background decorative icons */}
        <PageBackground page={currentPage} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
