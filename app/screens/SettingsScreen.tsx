import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hand, Zap, Shield, MessageCircle, User, ChevronRight, HelpCircle } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { state, setSelectionMode, showToast } = useAppContext();

  const openDrawer = () => {
    // #region agent log
    const navState = (navigation as any).getState?.();
    const parentState = (navigation as any).getParent?.()?.getState?.();
    fetch('http://127.0.0.1:7300/ingest/57385e69-e00c-43a4-8874-7310b7792ce9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d1ade8'},body:JSON.stringify({sessionId:'d1ade8',runId:'fix-nav-structure',hypothesisId:'H3',location:'SettingsScreen.tsx:openDrawer',message:'menu pressed - checking nav context',data:{navType:navState?.type,navRoutes:navState?.routeNames,parentType:parentState?.type,parentRoutes:parentState?.routeNames},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleModeChange = (mode: 'manual' | 'auto') => {
    setSelectionMode(mode);
    showToast('success', `Switched to ${mode === 'auto' ? 'Auto' : 'Manual'} Mode`);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" showMenu onMenuPress={openDrawer} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRAYER SELECTION MODE</Text>
            <Text style={styles.sectionIntro}>
              Choose how you want to find people to pray for — browse yourself or let us match you with those in greatest need.
            </Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={[styles.modeOption, state.selectionMode === 'manual' && styles.modeOptionActive]}
                onPress={() => handleModeChange('manual')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIcon, state.selectionMode === 'manual' && styles.modeIconActive]}>
                  <Hand size={22} color={state.selectionMode === 'manual' ? '#6B4F3E' : '#7A5C4A'} />
                </View>
                <View style={styles.modeContent}>
                  <Text style={[styles.modeTitle, state.selectionMode === 'manual' && styles.modeTitleActive]}>
                    Manual Mode
                  </Text>
                  <Text style={styles.modeDescription}>
                    Browse and select prayer requests yourself
                  </Text>
                </View>
                <View style={[styles.radioCircle, state.selectionMode === 'manual' && styles.radioCircleSelected]}>
                  {state.selectionMode === 'manual' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={[styles.modeOption, state.selectionMode === 'auto' && styles.modeOptionActive]}
                onPress={() => handleModeChange('auto')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIcon, state.selectionMode === 'auto' && styles.modeIconActive]}>
                  <Zap size={22} color={state.selectionMode === 'auto' ? '#6B4F3E' : '#7A5C4A'} fill={state.selectionMode === 'auto' ? '#6B4F3E' : 'transparent'} />
                </View>
                <View style={styles.modeContent}>
                  <Text style={[styles.modeTitle, state.selectionMode === 'auto' && styles.modeTitleActive]}>
                    Auto Mode
                  </Text>
                  <Text style={styles.modeDescription}>
                    We'll select someone who needs prayer most (skips requests with 3+ prayers)
                  </Text>
                </View>
                <View style={[styles.radioCircle, state.selectionMode === 'auto' && styles.radioCircleSelected]}>
                  {state.selectionMode === 'auto' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>

            {state.selectionMode === 'auto' && (
              <View style={styles.infoNote}>
                <Text style={styles.infoText}>
                  Auto assignments persist for 12 hours. The same person will be shown until you pray for them or the window expires.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRIVACY</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Shield size={20} color="#6B4F3E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Country-Only Visibility</Text>
                  <Text style={styles.infoDescription}>
                    Only your first name and country are visible to other users. Your email and personal details are never shared.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CHAT SAFETY</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <MessageCircle size={20} color="#6B4F3E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Live Room Safety</Text>
                  <View style={styles.rulesList}>
                    <Text style={styles.ruleItem}>• Never share phone numbers or emails</Text>
                    <Text style={styles.ruleItem}>• Report inappropriate messages</Text>
                    <Text style={styles.ruleItem}>• Keep conversations prayer-focused</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <View style={styles.card}>
              {state.currentUser && (
                <View style={styles.userRow}>
                  <View style={styles.userAvatar}>
                    <User size={20} color="#6B4F3E" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{state.currentUser.firstName}</Text>
                    <Text style={styles.userMeta}>
                      {state.currentUser.flag} {state.currentUser.country}
                      {state.currentUser.denomination && ` · ${state.currentUser.denomination}`}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => (navigation as any).navigate('HelpSafetyDrawer')}
                activeOpacity={0.7}
              >
                <View style={styles.linkLeft}>
                  <HelpCircle size={18} color="#6B4F3E" />
                  <Text style={styles.linkText}>Help & Safety</Text>
                </View>
                <ChevronRight size={18} color="#9B7B6A" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.version}>Belebi Prayer · Version 1.0.0 Prototype</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F4',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C3D2E',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionIntro: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 18,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    overflow: 'hidden',
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  modeOptionActive: {
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
  },
  modeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconActive: {
    backgroundColor: 'rgba(107, 79, 62, 0.15)',
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 2,
  },
  modeTitleActive: {
    color: '#6B4F3E',
  },
  modeDescription: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 18,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#6B4F3E',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B4F3E',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE0D4',
    marginHorizontal: 16,
  },
  infoNote: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#FFF8E7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F5D98A',
  },
  infoText: {
    fontSize: 13,
    color: '#7A5000',
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 18,
  },
  rulesList: {
    marginTop: 6,
    gap: 4,
  },
  ruleItem: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 18,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  userMeta: {
    fontSize: 13,
    color: '#7A5C4A',
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkText: {
    fontSize: 15,
    color: '#1C0F0A',
    fontWeight: '500',
  },
  version: {
    fontSize: 12,
    color: '#9B7B6A',
    textAlign: 'center',
    marginTop: 8,
  },
});
