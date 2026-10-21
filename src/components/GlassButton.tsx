import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

const GlassButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  disabled = false
}: GlassButtonProps) => {
  
  const variants = {
    primary: 'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    secondary: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    danger: 'from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        bg-gradient-to-r ${variants[variant]}
        text-white font-bold rounded-xl
        ${sizes[size]}
        shadow-premium-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        flex items-center justify-center gap-2
        ${className}
      `}
      whileHover={!disabled ? { 
        scale: 1.02,
        boxShadow: '0 20px 30px -10px rgba(16, 185, 129, 0.4)'
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </motion.button>
  );
};

export default GlassButton;
