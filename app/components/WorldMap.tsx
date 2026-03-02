import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Country } from '../data/mockData';
import { colors } from '../theme/colors';

interface WorldMapProps {
  countries: Country[];
  onCountrySelect: (country: Country) => void;
}

const INITIAL_REGION = {
  latitude: 20,
  longitude: 0,
  latitudeDelta: 100,
  longitudeDelta: 180,
};

const THRESHOLD_COLORS = {
  low: '#3B82F6',      // Blue (1-99)
  moderate: '#F59E0B', // Amber (100-999)
  high: '#F97316',     // Orange (1,000-9,999)
  veryHigh: '#EF4444', // Red (10,000+)
};

function getMarkerSize(count: number): number {
  if (count >= 10000) return 44;
  if (count >= 1000) return 40;
  if (count >= 100) return 36;
  return 32;
}

function getMarkerColor(count: number): string {
  if (count >= 10000) return THRESHOLD_COLORS.veryHigh;
  if (count >= 1000) return THRESHOLD_COLORS.high;
  if (count >= 100) return THRESHOLD_COLORS.moderate;
  return THRESHOLD_COLORS.low;
}

function formatCount(count: number): string {
  if (count >= 10000) return `${Math.floor(count / 1000)}K`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export default function WorldMap({ countries, onCountrySelect }: WorldMapProps) {
  const uniqueCountries = useMemo(() => {
    const seen = new Set<string>();
    return countries.filter((country) => {
      if (!country.lat || !country.lon) return false;
      if (seen.has(country.code)) return false;
      seen.add(country.code);
      return true;
    });
  }, [countries]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_REGION}
        rotateEnabled={false}
        pitchEnabled={false}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        toolbarEnabled={false}
        minZoomLevel={1}
        maxZoomLevel={8}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {uniqueCountries.map((country) => {
          const size = getMarkerSize(country.activeRequests);
          const bgColor = getMarkerColor(country.activeRequests);

          return (
            <Marker
              key={country.code}
              coordinate={{
                latitude: country.lat,
                longitude: country.lon,
              }}
              onPress={() => onCountrySelect(country)}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View style={[styles.markerOuter, { width: size, height: size }]}>
                <View style={[styles.marker, { backgroundColor: bgColor }]}>
                  <Text style={[styles.markerText, size >= 40 && styles.markerTextLarge]}>
                    {formatCount(country.activeRequests)}
                  </Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THRESHOLD_COLORS.low }]} />
            <Text style={styles.legendLabel}>1-99</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THRESHOLD_COLORS.moderate }]} />
            <Text style={styles.legendLabel}>100+</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THRESHOLD_COLORS.high }]} />
            <Text style={styles.legendLabel}>1K+</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THRESHOLD_COLORS.veryHigh }]} />
            <Text style={styles.legendLabel}>10K+</Text>
          </View>
        </View>
        <Text style={styles.legendHint}>Tap a marker to pray for that country</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
  },
  markerOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  markerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  markerTextLarge: {
    fontSize: 12,
  },
  legend: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
    borderRadius: 24,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  legendLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  legendHint: {
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});
