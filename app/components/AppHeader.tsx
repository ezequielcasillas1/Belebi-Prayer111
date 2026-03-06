import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { ArrowLeft, Menu, Plus, Settings } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showSettings?: boolean;
  showAdd?: boolean;
  onMenuPress?: () => void;
  onAddPress?: () => void;
  onSettingsPress?: () => void;
  rightElement?: React.ReactNode;
}

export default function AppHeader({
  title,
  subtitle,
  showBack,
  showMenu,
  showSettings,
  showAdd,
  onMenuPress,
  onAddPress,
  onSettingsPress,
  rightElement,
}: AppHeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleMenu = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const handleSettings = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      (navigation as any).navigate('SettingsDrawer');
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} style={styles.iconButton} activeOpacity={0.7}>
              <ArrowLeft size={22} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          {showMenu && (
            <TouchableOpacity onPress={handleMenu} style={styles.iconButton} activeOpacity={0.7}>
              <Menu size={22} color={colors.text.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightElement}
          {showAdd && (
            <TouchableOpacity onPress={onAddPress} style={styles.iconButton} activeOpacity={0.7}>
              <Plus size={22} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          {showSettings && (
            <TouchableOpacity onPress={handleSettings} style={styles.iconButton} activeOpacity={0.7}>
              <Settings size={22} color={colors.text.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.ui.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.ui.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.borderLight,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.secondary.dark}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
