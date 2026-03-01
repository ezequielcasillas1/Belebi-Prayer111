import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Home, Users, BookmarkPlus, Send, PlusCircle, Settings, HelpCircle, LogOut, User } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';
import Badge from './Badge';
import { colors } from '../theme/colors';

const navItems = [
  { key: 'HomeDrawer', label: 'Home', icon: Home },
  { key: 'PrayerListDrawer', label: 'Prayer List', icon: Users },
  { key: 'PlanPrayerDrawer', label: 'Plan Prayer', icon: BookmarkPlus },
  { key: 'PrayersSentDrawer', label: 'Prayers Sent', icon: Send },
  { key: 'CreateRequestDrawer', label: 'Ask for Prayer', icon: PlusCircle },
  { key: 'SettingsDrawer', label: 'Settings', icon: Settings },
  { key: 'HelpSafetyDrawer', label: 'Help & Safety', icon: HelpCircle },
];

export default function DrawerNav(props: DrawerContentComponentProps) {
  const navigation = useNavigation();
  const { state: appState, logout } = useAppContext();
  const currentRoute = props.state.routeNames[props.state.index];

  const handleNavigation = (drawerKey: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate(drawerKey);
  };

  const handleLogout = () => {
    props.navigation.closeDrawer();
    // Just call logout - the RootNavigator will automatically switch to the unauthenticated
    // branch which includes the Welcome screen. No manual navigation reset needed.
    logout();
  };

  const isGuest = appState.currentUser?.id === 'guest';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoEmoji}>🙏</Text>
          <View>
            <Text style={styles.logoTitle}>Belebi</Text>
            <Text style={styles.logoSubtitle}>Prayer</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userFlag}>{appState.currentUser?.flag || '🌍'}</Text>
          </View>
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{appState.currentUser?.firstName || 'User'}</Text>
              {isGuest && <Badge variant="info" size="sm">Guest</Badge>}
            </View>
            <Text style={styles.userCountry}>{appState.currentUser?.country || 'Worldwide'}</Text>
          </View>
        </View>

        <View style={styles.modeIndicator}>
          <View
            style={[styles.modeDot, { backgroundColor: appState.selectionMode === 'auto' ? '#22C55E' : '#9CA3AF' }]}
          />
          <Text style={styles.modeText}>
            {appState.selectionMode === 'auto' ? 'Auto Mode' : 'Manual Mode'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.navList} showsVerticalScrollIndicator={false}>
        {navItems.map((item) => {
          const isActive = currentRoute === item.key;
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => handleNavigation(item.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconBox, isActive && styles.navIconBoxActive]}>
                <Icon size={20} color={isActive ? colors.secondary.dark : colors.text.muted} />
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <LogOut size={20} color="#7A1E1E" />
          <Text style={styles.logoutText}>{isGuest ? 'Sign In / Register' : 'Sign Out'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.borderLight,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 32,
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  logoSubtitle: {
    fontSize: 13,
    color: colors.secondary.dark,
    letterSpacing: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.secondary.dark}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userFlag: {
    fontSize: 22,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  userCountry: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: colors.primary.medium,
    borderRadius: 10,
  },
  modeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  navList: {
    flex: 1,
    paddingVertical: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: `${colors.secondary.dark}14`,
  },
  navIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconBoxActive: {
    backgroundColor: `${colors.secondary.dark}26`,
  },
  navLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: colors.secondary.dark,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.ui.borderLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.error.text,
  },
});
