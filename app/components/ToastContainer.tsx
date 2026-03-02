import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CheckCircle, XCircle, Info, X } from 'lucide-react-native';
import { useUIStore } from '../stores/uiStore';
import { colors as themeColors } from '../theme/colors';

export default function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? XCircle : Info;
        const colors = {
          success: { bg: themeColors.success.bg, border: themeColors.success.border, text: themeColors.success.text, icon: themeColors.success.text },
          error: { bg: themeColors.error.bg, border: themeColors.error.border, text: themeColors.error.text, icon: themeColors.error.text },
          info: { bg: themeColors.ui.background, border: themeColors.ui.borderLight, text: themeColors.text.secondary, icon: themeColors.secondary.dark },
        }[toast.type];

        return (
          <View
            key={toast.id}
            style={[
              styles.toast,
              {
                backgroundColor: colors.bg,
                borderColor: colors.border,
              },
            ]}
          >
            <Icon size={20} color={colors.icon} />
            <Text style={[styles.toastText, { color: colors.text }]} numberOfLines={2}>
              {toast.message}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: '100%',
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
