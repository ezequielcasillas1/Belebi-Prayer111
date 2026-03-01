import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type BadgeVariant = 'denomination' | 'status' | 'country' | 'success' | 'warning' | 'error' | 'info' | 'emergency';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  denomination: {
    bg: colors.primary.light,
    text: colors.text.secondary,
    border: colors.ui.border,
  },
  status: {
    bg: colors.primary.medium,
    text: colors.text.primary,
    border: colors.ui.border,
  },
  country: {
    bg: colors.info.bg,
    text: colors.info.text,
    border: colors.info.border,
  },
  success: {
    bg: colors.success.bg,
    text: colors.success.text,
    border: colors.success.border,
  },
  warning: {
    bg: colors.warning.bg,
    text: colors.warning.text,
    border: colors.warning.border,
  },
  error: {
    bg: colors.error.bg,
    text: colors.error.text,
    border: colors.error.border,
  },
  info: {
    bg: colors.secondary.light,
    text: colors.secondary.dark,
    border: colors.secondary.medium,
  },
  emergency: {
    bg: colors.error.bg,
    text: colors.error.text,
    border: colors.error.border,
  },
};

const sizeStyles: Record<BadgeSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 11 },
  md: { paddingVertical: 6, paddingHorizontal: 13, fontSize: 13 },
};

export default function Badge({ children, variant = 'denomination', size = 'md' }: BadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
      ]}
    >
      <Text style={[styles.text, { color: variantStyle.text, fontSize: sizeStyle.fontSize }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
});
