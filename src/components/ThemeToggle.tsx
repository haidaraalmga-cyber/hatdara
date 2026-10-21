import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative group p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
        'text-gray-700 dark:text-gray-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/30'
      }`}
      whileTap={{ scale: 0.98 }}
      title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
      aria-label="تبديل الوضع الليلي/النهاري"
    >
      {/* Icon - no movement */}
      <div className="relative z-10">
        {isDark ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </div>

      {/* Subtle dual-color Glow effect on hover - no movement */}
      <div
        className={`absolute inset-0 rounded-xl ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-violet-500' 
            : 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500'
        } opacity-0 blur-md group-hover:opacity-20 transition-opacity duration-500`}
      />

      {/* Bottom glow bar - no animation */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 rounded-full ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-violet-500' 
            : 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500'
        } transition-all duration-300 group-hover:w-8`}
      />

      {/* Tooltip on hover - no animation */}
      <div
        className={`absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/50' 
            : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/50'
        } text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      >
        {isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
        <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 ${
          isDark 
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
            : 'bg-gradient-to-br from-amber-600 to-orange-600'
        } rotate-45`} />
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
