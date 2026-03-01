import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, ChevronDown, ChevronUp, Flag, Phone } from 'lucide-react-native';

export default function SafetyBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Shield size={18} color="#7A5000" />
          <Text style={styles.headerText}>Safety Reminder</Text>
        </View>
        {expanded ? (
          <ChevronUp size={18} color="#7A5000" />
        ) : (
          <ChevronDown size={18} color="#7A5000" />
        )}
      </View>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.rule}>
            <Text style={styles.bullet}>•</Text> Never share your phone number, email, or home address
          </Text>
          <Text style={styles.rule}>
            <Text style={styles.bullet}>•</Text> Keep conversations focused on prayer and encouragement
          </Text>
          <Text style={styles.rule}>
            <Text style={styles.bullet}>•</Text> Report any suspicious or inappropriate behavior
          </Text>

          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <Flag size={14} color="#7A5000" />
              <Text style={styles.actionText}>Tap the flag icon on any message to report</Text>
            </View>
            <View style={styles.actionItem}>
              <Phone size={14} color="#7A5000" />
              <Text style={styles.actionText}>Contact local authorities for emergencies</Text>
            </View>
          </View>
        </View>
      )}

      {!expanded && (
        <Text style={styles.tapText}>Tap to read</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#F5D98A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A5000',
  },
  tapText: {
    fontSize: 12,
    color: '#7A5000',
    marginTop: 4,
  },
  content: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5D98A',
  },
  rule: {
    fontSize: 13,
    color: '#7A5000',
    lineHeight: 20,
    marginBottom: 8,
  },
  bullet: {
    fontWeight: '700',
  },
  actions: {
    marginTop: 8,
    gap: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#7A5000',
  },
});
