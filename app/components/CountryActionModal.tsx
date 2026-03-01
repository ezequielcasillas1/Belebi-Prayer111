import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { X, Globe, Users, MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Country } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CountryActionModalProps {
  country: Country | null;
  onClose: () => void;
}

export default function CountryActionModal({ country, onClose }: CountryActionModalProps) {
  const navigation = useNavigation<NavigationProp>();

  if (!country) return null;

  const handleAction = (action: 'nation' | 'people' | 'room') => {
    onClose();
    setTimeout(() => {
      switch (action) {
        case 'nation':
          navigation.navigate('PrayForNation', { countryCode: country.code });
          break;
        case 'people':
          navigation.navigate('Directory', { countryCode: country.code });
          break;
        case 'room':
          navigation.navigate('LivePrayerRoom', { countryCode: country.code });
          break;
      }
    }, 100);
  };

  return (
    <Modal visible={!!country} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.flag}>{country.flag}</Text>
              <View>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.requestCount}>{country.activeRequests} active requests</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#5C3D2E" />
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionCard} onPress={() => handleAction('nation')} activeOpacity={0.7}>
              <View style={styles.actionIconBox}>
                <Globe size={24} color="#6B4F3E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Pray for the Nation</Text>
                <Text style={styles.actionSubtitle}>Intercede for the country</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => handleAction('people')} activeOpacity={0.7}>
              <View style={styles.actionIconBox}>
                <Users size={24} color="#6B4F3E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Pray for the People</Text>
                <Text style={styles.actionSubtitle}>{country.activeRequests} active prayer requests</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => handleAction('room')} activeOpacity={0.7}>
              <View style={styles.actionIconBox}>
                <MessageCircle size={24} color="#6B4F3E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Live Prayer Room</Text>
                <Text style={styles.actionSubtitle}>Join the live country chat</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FDFCFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#D4C4B0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE0D4',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 36,
  },
  countryName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  requestCount: {
    fontSize: 14,
    color: '#5C3D2E',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#5C3D2E',
    marginTop: 2,
  },
});
