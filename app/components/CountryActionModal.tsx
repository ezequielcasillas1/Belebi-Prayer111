import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { X, Globe, Users, MessageCircle, Lock, Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Country } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CountryActionModalProps {
  country: Country | null;
  onClose: () => void;
}

export default function CountryActionModal({ country, onClose }: CountryActionModalProps) {
  const navigation = useNavigation<NavigationProp>();
  const [prayedRecorded, setPrayedRecorded] = useState(false);

  if (!country) return null;

  const isRestricted = country.isRestricted ?? false;

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

  const handleIPrayed = () => {
    setPrayedRecorded(true);
    setTimeout(() => {
      setPrayedRecorded(false);
    }, 3000);
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
                <View style={styles.countryNameRow}>
                  <Text style={styles.countryName}>{country.name}</Text>
                  {isRestricted && (
                    <View style={styles.restrictedBadge}>
                      <Lock size={12} color="#7C3AED" />
                      <Text style={styles.restrictedBadgeText}>Restricted</Text>
                    </View>
                  )}
                </View>
                {isRestricted ? (
                  <Text style={styles.restrictedNote}>Limited internet access nation</Text>
                ) : (
                  <Text style={styles.requestCount}>{country.activeRequests} active requests</Text>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#5C3D2E" />
            </TouchableOpacity>
          </View>

          {isRestricted && (
            <View style={styles.restrictedInfo}>
              <Text style={styles.restrictedInfoText}>
                This nation has restricted internet access. Users cannot sign up from here, but you can pray for the persecuted church and believers in {country.name}.
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionCard} onPress={() => handleAction('nation')} activeOpacity={0.7}>
              <View style={styles.actionIconBox}>
                <Globe size={24} color="#6B4F3E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Pray for the Nation</Text>
                <Text style={styles.actionSubtitle}>Intercede for {country.name}</Text>
              </View>
            </TouchableOpacity>

            {!isRestricted && (
              <TouchableOpacity style={styles.actionCard} onPress={() => handleAction('people')} activeOpacity={0.7}>
                <View style={styles.actionIconBox}>
                  <Users size={24} color="#6B4F3E" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Pray for the People</Text>
                  <Text style={styles.actionSubtitle}>{country.activeRequests} active prayer requests</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionCard} onPress={() => handleAction('room')} activeOpacity={0.7}>
              <View style={styles.actionIconBox}>
                <MessageCircle size={24} color="#6B4F3E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Live Prayer Room</Text>
                <Text style={styles.actionSubtitle}>Join others praying for {country.name}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.iPrayedCard, prayedRecorded && styles.iPrayedCardActive]} 
              onPress={handleIPrayed} 
              activeOpacity={0.7}
              disabled={prayedRecorded}
            >
              <View style={[styles.actionIconBox, styles.iPrayedIconBox]}>
                <Heart size={24} color={prayedRecorded ? '#FFFFFF' : '#E11D48'} fill={prayedRecorded ? '#FFFFFF' : 'transparent'} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, prayedRecorded && styles.iPrayedTextActive]}>
                  {prayedRecorded ? 'Prayer Recorded!' : 'I Prayed for This Nation'}
                </Text>
                <Text style={[styles.actionSubtitle, prayedRecorded && styles.iPrayedTextActive]}>
                  {prayedRecorded ? 'Thank you for praying' : 'Record your prayer'}
                </Text>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE0D4',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  flag: {
    fontSize: 36,
  },
  countryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  countryName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  restrictedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  restrictedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  requestCount: {
    fontSize: 14,
    color: '#5C3D2E',
    marginTop: 2,
  },
  restrictedNote: {
    fontSize: 13,
    color: '#7C3AED',
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
  restrictedInfo: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    backgroundColor: 'rgba(124, 58, 237, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.15)',
  },
  restrictedInfoText: {
    fontSize: 13,
    color: '#5C3D2E',
    lineHeight: 20,
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
  iPrayedCard: {
    borderColor: 'rgba(225, 29, 72, 0.3)',
    backgroundColor: 'rgba(225, 29, 72, 0.04)',
  },
  iPrayedCardActive: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  iPrayedIconBox: {
    backgroundColor: 'rgba(225, 29, 72, 0.1)',
  },
  iPrayedTextActive: {
    color: '#FFFFFF',
  },
});
