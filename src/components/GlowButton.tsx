import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const GlowButton = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  icon,
  className = '',
  disabled = false
}: GlowButtonProps) => {
  
  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      hover: 'hover:from-emerald-600 hover:to-emerald-700',
      glow: 'from-emerald-400 to-emerald-500',
      shadow: 'shadow-emerald-500/50',
    },
    secondary: {
      bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      hover: 'hover:from-cyan-600 hover:to-cyan-700',
      glow: 'from-cyan-400 to-cyan-500',
      shadow: 'shadow-cyan-500/50',
    },
    danger: {
      bg: 'bg-gradient-to-r from-red-500 to-red-600',
      hover: 'hover:from-red-600 hover:to-red-700',
      glow: 'from-red-400 to-red-500',
      shadow: 'shadow-red-500/50',
    },
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      hover: 'hover:from-green-600 hover:to-green-700',
      glow: 'from-green-400 to-green-500',
      shadow: 'shadow-green-500/50',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700',
      glow: 'from-blue-400 to-blue-500',
      shadow: 'shadow-blue-500/50',
    },
  };

  const variantStyles = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group px-6 py-3 rounded-xl font-semibold text-white
        ${variantStyles.bg} ${variantStyles.hover}
        transition-all duration-300 overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg ${variantStyles.shadow}
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${variantStyles.glow} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.4 }}
      />
      
      {/* Top shine effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Bottom glow line */}
      <motion.div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r ${variantStyles.glow} opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300`}
        initial={{ width: '0%' }}
        whileHover={{ width: '90%' }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>}
        {children}
      </span>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/30 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
};

export default GlowButton;
