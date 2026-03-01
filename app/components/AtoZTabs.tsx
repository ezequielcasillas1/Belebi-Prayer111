import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface AtoZTabsProps {
  selected: string;
  onChange: (letter: string) => void;
  availableLetters?: Set<string>;
}

export default function AtoZTabs({ selected, onChange, availableLetters }: AtoZTabsProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = LETTERS.indexOf(selected);
    if (index >= 0 && scrollRef.current) {
      scrollRef.current.scrollTo({ x: Math.max(0, index * 40 - 100), animated: true });
    }
  }, [selected]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LETTERS.map((letter) => {
          const isSelected = letter === selected;
          const isAvailable = !availableLetters || availableLetters.has(letter);

          return (
            <TouchableOpacity
              key={letter}
              style={[
                styles.letterButton,
                isSelected && styles.letterButtonSelected,
                !isAvailable && styles.letterButtonUnavailable,
              ]}
              onPress={() => isAvailable && onChange(letter)}
              disabled={!isAvailable}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.letterText,
                  isSelected && styles.letterTextSelected,
                  !isAvailable && styles.letterTextUnavailable,
                ]}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 8,
    gap: 6,
  },
  letterButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterButtonSelected: {
    backgroundColor: '#6B4F3E',
  },
  letterButtonUnavailable: {
    backgroundColor: 'transparent',
  },
  letterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5C3D2E',
  },
  letterTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  letterTextUnavailable: {
    color: '#C4A89A',
  },
});
