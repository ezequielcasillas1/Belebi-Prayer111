import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, colors } from '../theme/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'card';
  style?: ViewStyle;
}

export default function GradientBackground({ 
  children, 
  variant = 'primary',
  style 
}: GradientBackgroundProps) {
  const gradient = gradients[variant];

  return (
    <LinearGradient
      colors={gradient.colors}
      locations={gradient.locations}
      style={[styles.gradient, style]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

export function RadialGradientBackground({ 
  children, 
  style 
}: Omit<GradientBackgroundProps, 'variant'>) {
  return (
    <LinearGradient
      colors={[colors.primary.light, colors.primary.medium, colors.primary.dark]}
      locations={[0, 0.6, 1]}
      style={[styles.gradient, style]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
