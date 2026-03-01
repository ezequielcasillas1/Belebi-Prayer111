import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { Flag, X, AlertTriangle } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'profile' | 'message';
  targetName?: string;
}

const REPORT_REASONS = [
  'Inappropriate content',
  'Sharing personal contact information',
  'Spam or self-promotion',
  'Harassment or bullying',
  'Misinformation',
  'Suspicious activity',
  'Other',
];

export default function ReportModal({ isOpen, onClose, targetType, targetName }: ReportModalProps) {
  const { showToast } = useAppContext();

  const handleReport = (reason: string) => {
    showToast('success', 'Report submitted. Thank you for helping keep our community safe.');
    onClose();
  };

  const title = targetType === 'profile' ? 'Report Prayer Request' : 'Report Message';

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.flagIcon}>
                <Flag size={20} color="#7A1E1E" />
              </View>
              <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#5C3D2E" />
            </TouchableOpacity>
          </View>

          {targetName && (
            <View style={styles.targetInfo}>
              <Text style={styles.targetLabel}>Reporting:</Text>
              <Text style={styles.targetName}>{targetName}</Text>
            </View>
          )}

          <View style={styles.safetyNote}>
            <AlertTriangle size={18} color="#7A5000" />
            <Text style={styles.safetyText}>
              If you believe someone is in immediate danger, please contact your local authorities.
            </Text>
          </View>

          <ScrollView style={styles.reasons} showsVerticalScrollIndicator={false}>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.reasonButton}
                onPress={() => handleReport(reason)}
                activeOpacity={0.7}
              >
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    backgroundColor: '#FDF9F4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
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
    gap: 10,
  },
  flagIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 12,
  },
  targetLabel: {
    fontSize: 14,
    color: '#7A5C4A',
  },
  targetName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5D98A',
  },
  safetyText: {
    flex: 1,
    fontSize: 13,
    color: '#7A5000',
    lineHeight: 18,
  },
  reasons: {
    padding: 20,
  },
  reasonButton: {
    padding: 16,
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 15,
    color: '#1C0F0A',
    fontWeight: '500',
  },
});
