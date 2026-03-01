import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const sizes = {
  sm: { height: 36, paddingHorizontal: 14, fontSize: 13 },
  md: { height: 44, paddingHorizontal: 18, fontSize: 15 },
  lg: { height: 52, paddingHorizontal: 24, fontSize: 16 },
};

export function PrimaryButton({
  children,
  onPress,
  fullWidth,
  size = 'md',
  disabled,
  loading,
  icon,
}: ButtonProps) {
  const sizeStyle = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.buttonBase,
        {
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          backgroundColor: disabled ? colors.button.primaryDisabled : colors.button.primary,
        },
        fullWidth && styles.fullWidth,
        styles.shadow,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.primaryText, { fontSize: sizeStyle.fontSize }]}>{children}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function SecondaryButton({
  children,
  onPress,
  fullWidth,
  size = 'md',
  disabled,
  loading,
  icon,
}: ButtonProps) {
  const sizeStyle = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.buttonBase,
        styles.secondaryButton,
        {
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          borderColor: disabled ? colors.button.primaryDisabled : colors.button.primary,
        },
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.button.primary} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.secondaryText,
              { fontSize: sizeStyle.fontSize, color: disabled ? colors.button.primaryDisabled : colors.button.primary },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function GhostButton({
  children,
  onPress,
  fullWidth,
  size = 'md',
  disabled,
  loading,
  icon,
}: ButtonProps) {
  const sizeStyle = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.buttonBase,
        styles.ghostButton,
        { height: sizeStyle.height, paddingHorizontal: sizeStyle.paddingHorizontal },
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.button.primary} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.ghostText,
              { fontSize: sizeStyle.fontSize, color: disabled ? colors.button.primaryDisabled : colors.button.primary },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function DestructiveButton({
  children,
  onPress,
  fullWidth,
  size = 'md',
  disabled,
  loading,
  icon,
}: ButtonProps) {
  const sizeStyle = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.buttonBase,
        styles.destructiveButton,
        {
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          borderColor: disabled ? '#C4A89A' : '#7A1E1E',
        },
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#7A1E1E" size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.destructiveText,
              { fontSize: sizeStyle.fontSize, color: disabled ? '#C4A89A' : '#7A1E1E' },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  disabled?: boolean;
  variant?: 'default' | 'transparent';
}

export function IconButton({ icon, onPress, size = 40, disabled, variant = 'default' }: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.iconButton,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: variant === 'transparent' ? 'transparent' : `${colors.button.primary}1A`,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  shadow: {
    shadowColor: colors.button.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  secondaryText: {
    fontWeight: '600',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    fontWeight: '500',
  },
  destructiveButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  destructiveText: {
    fontWeight: '600',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
