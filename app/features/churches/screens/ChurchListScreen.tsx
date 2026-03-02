import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Church, Plus, Users, ChevronRight } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import { useUserChurches } from '../hooks/useChurchQueries';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { colors } from '../../../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ChurchListScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  const { 
    data: churches = [], 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isRefetching 
  } = useUserChurches();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleChurchPress = (churchId: string) => {
    navigation.navigate('ChurchDetail', { churchId });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader title="My Churches" showMenu showBack />
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#6B4F3E" />
          <Text style={styles.loadingText}>Loading churches...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <AppHeader title="My Churches" showMenu showBack />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>{(error as Error)?.message || 'Failed to load churches'}</Text>
          <SecondaryButton onPress={handleRefresh}>Try Again</SecondaryButton>
        </View>
      </View>
    );
  }

  if (churches.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader title="My Churches" showMenu showBack />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Church size={36} color="#6B4F3E" />
          </View>
          <Text style={styles.emptyTitle}>No Churches Yet</Text>
          <Text style={styles.emptySubtitle}>
            Join a church community to connect with fellow believers and share prayers within your congregation.
          </Text>
          <View style={styles.emptyActions}>
            <PrimaryButton
              fullWidth
              icon={<Plus size={18} color="#FFF" />}
              onPress={() => navigation.navigate('JoinChurch')}
            >
              Join a Church
            </PrimaryButton>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="My Churches" showMenu showBack />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor={colors.secondary.dark} />
        }
      >
        <View style={styles.content}>
          <View style={styles.headerActions}>
            <SecondaryButton
              size="sm"
              icon={<Plus size={16} color="#6B4F3E" />}
              onPress={() => navigation.navigate('JoinChurch')}
            >
              Join Church
            </SecondaryButton>
          </View>

          <View style={styles.churchList}>
            {churches.map((church) => (
              <TouchableOpacity
                key={church.id}
                style={styles.churchCard}
                onPress={() => handleChurchPress(church.id)}
                activeOpacity={0.7}
              >
                <View style={styles.churchIcon}>
                  <Church size={24} color="#6B4F3E" />
                </View>
                <View style={styles.churchInfo}>
                  <Text style={styles.churchName}>{church.name}</Text>
                  <Text style={styles.churchDenomination}>{church.denomination}</Text>
                  <View style={styles.memberRow}>
                    <Users size={14} color="#7A5C4A" />
                    <Text style={styles.memberCount}>{church.member_count} members</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9B7B6A" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 15,
    color: colors.error.text,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyActions: {
    width: '100%',
    gap: 12,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  churchList: {
    gap: 12,
  },
  churchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    gap: 14,
  },
  churchIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  churchInfo: {
    flex: 1,
  },
  churchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 4,
  },
  churchDenomination: {
    fontSize: 13,
    color: '#7A5C4A',
    marginBottom: 6,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberCount: {
    fontSize: 13,
    color: '#7A5C4A',
  },
});
