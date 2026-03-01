import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
  label?: string;
  height?: number;
}

export default function ImageCarousel({ images, label, height = 220 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  if (images.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <ImageIcon size={32} color="#9B7B6A" />
        <Text style={styles.emptyText}>No images</Text>
      </View>
    );
  }

  const imageWidth = SCREEN_WIDTH - 32;

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={[styles.image, { width: imageWidth, height }]}
            resizeMode="cover"
          />
        )}
        getItemLayout={(_, index) => ({
          length: imageWidth,
          offset: imageWidth * index,
          index,
        })}
      />

      {label && (
        <View style={styles.labelBadge}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      )}

      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <TouchableOpacity style={[styles.navButton, styles.navButtonLeft]} onPress={handlePrev}>
              <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>
          )}
          {currentIndex < images.length - 1 && (
            <TouchableOpacity style={[styles.navButton, styles.navButtonRight]} onPress={handleNext}>
              <ChevronRight size={24} color="#FFF" />
            </TouchableOpacity>
          )}

          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentIndex && styles.dotActive]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E8D8C8',
  },
  emptyContainer: {
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  emptyText: {
    fontSize: 14,
    color: '#9B7B6A',
    marginTop: 8,
  },
  image: {
    backgroundColor: '#E8D8C8',
  },
  labelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -18 }],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonLeft: {
    left: 12,
  },
  navButtonRight: {
    right: 12,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
});
