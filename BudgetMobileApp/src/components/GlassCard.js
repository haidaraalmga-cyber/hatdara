import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, borderRadius, spacing } from '../utils/theme';

/**
 * 🎨 Glass Card Component - نفس تصميم الويب
 * بطاقة زجاجية مع تأثيرات احترافية
 */
const GlassCard = ({ 
  children, 
  style, 
  gradient = null,
  glassEffect = true,
  shadowColor = null,
  onPress = null,
}) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  // إذا كان هناك gradient
  if (gradient) {
    return (
      <Animated.View style={[animatedStyle]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            shadowColor && getShadowStyle(shadowColor),
            style,
          ]}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );
  }

  // Glass effect
  return (
    <Animated.View
      style={[
        styles.card,
        glassEffect && styles.glass,
        shadowColor && getShadowStyle(shadowColor),
        style,
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const getShadowStyle = (color) => {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  };
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151522',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    ...shadows.lg,
  },
  
  glass: {
    backgroundColor: 'rgba(21, 21, 34, 0.8)',
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
});

export default GlassCard;
