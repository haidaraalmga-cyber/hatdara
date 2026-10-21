// 🎨 Theme System - نفس ألوان وتأثيرات الويب
export const colors = {
  // Background Gradients
  bgPrimary: '#0a0a0a',
  bgSecondary: '#151522',
  bgTertiary: '#1e1e2e',
  
  // Light mode backgrounds
  bgPrimaryLight: '#ffffff',
  bgSecondaryLight: '#f0fdf4',
  bgTertiaryLight: '#ecfdf5',
  
  // Text Colors
  textPrimary: '#ffffff',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  
  // Primary Colors - Emerald/Teal
  primary: '#10b981',
  primaryDark: '#059669',
  primaryLight: '#34d399',
  
  secondary: '#14b8a6',
  secondaryDark: '#0d9488',
  secondaryLight: '#2dd4bf',
  
  // Status Colors
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Gradient Colors
  emerald: {
    from: '#10b981',
    via: '#14b8a6',
    to: '#059669',
  },
  
  red: {
    from: '#ef4444',
    via: '#f87171',
    to: '#dc2626',
  },
  
  amber: {
    from: '#f59e0b',
    via: '#fbbf24',
    to: '#d97706',
  },
  
  indigo: {
    from: '#6366f1',
    via: '#818cf8',
    to: '#4f46e5',
  },
  
  purple: {
    from: '#a855f7',
    via: '#c084fc',
    to: '#9333ea',
  },
  
  blue: {
    from: '#3b82f6',
    via: '#60a5fa',
    to: '#2563eb',
  },
};

// Shadows - تأثيرات الظلال
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  
  // Colored shadows
  emerald: {
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  red: {
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  amber: {
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Border Radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

// Typography
export const typography = {
  // Font Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  
  // Font Weights
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// Glassmorphism Effect
export const glassmorphism = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  borderWidth: 1,
};

// Card Styles - نفس تصميم الويب
export const cardStyles = {
  default: {
    backgroundColor: '#151522',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  
  gradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.xl,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  
  glass: {
    backgroundColor: 'rgba(21, 21, 34, 0.6)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    ...shadows.md,
  },
};

// Animation Durations
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export default {
  colors,
  shadows,
  borderRadius,
  spacing,
  typography,
  glassmorphism,
  cardStyles,
  animations,
};
