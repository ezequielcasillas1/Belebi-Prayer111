import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { Country } from '../data/mockData';

interface WorldMapProps {
  countries: Country[];
  onCountrySelect: (country: Country) => void;
}

const CONTINENT_PATHS = {
  northAmerica: 'M 95,55 C 120,48 195,52 262,65 L 275,85 L 272,120 L 255,152 L 232,185 L 208,215 L 183,228 L 162,222 L 148,200 L 130,172 L 104,148 L 82,118 L 72,85 Z',
  greenland: 'M 192,18 L 240,12 L 272,20 L 268,42 L 245,52 L 208,52 L 190,38 Z',
  southAmerica: 'M 192,235 L 242,225 L 272,245 L 285,275 L 288,315 L 275,358 L 254,385 L 222,400 L 190,398 L 168,378 L 156,348 L 155,308 L 165,270 L 178,252 Z',
  europe: 'M 432,48 L 505,42 L 538,58 L 548,82 L 538,105 L 558,118 L 548,138 L 510,150 L 475,158 L 448,150 L 432,128 L 428,92 Z',
  africa: 'M 440,162 L 495,155 L 538,162 L 568,188 L 580,228 L 578,272 L 562,318 L 538,348 L 508,362 L 476,368 L 448,352 L 428,322 L 418,282 L 418,240 L 430,202 Z',
  asia: 'M 548,42 L 658,38 L 755,40 L 848,52 L 918,68 L 942,98 L 932,132 L 902,152 L 862,142 L 822,168 L 788,182 L 745,178 L 705,198 L 658,208 L 608,198 L 572,182 L 548,158 L 542,118 L 548,72 Z',
  seAsia: 'M 718,198 L 752,192 L 768,225 L 758,258 L 740,262 L 722,242 L 716,218 Z',
  oceania: 'M 748,282 L 818,268 L 882,272 L 922,298 L 918,332 L 878,358 L 822,368 L 768,352 L 745,322 L 742,298 Z',
};

function latLonToXY(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * 900;
  const y = ((90 - lat) / 180) * 450;
  return { x, y };
}

export default function WorldMap({ countries, onCountrySelect }: WorldMapProps) {
  const [pressedCountry, setPressedCountry] = useState<string | null>(null);

  const uniqueCountries = countries.filter(
    (country, index, self) => index === self.findIndex((c) => c.code === country.code)
  );

  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 900 450" style={styles.svg}>
        {Object.values(CONTINENT_PATHS).map((path, index) => (
          <Path
            key={index}
            d={path}
            fill="#D4C4B0"
            stroke="#B8A090"
            strokeWidth={1}
          />
        ))}

        {uniqueCountries.map((country) => {
          const { x, y } = latLonToXY(country.lat, country.lon);
          const isPressed = pressedCountry === country.code;
          const radius = isPressed ? 12 : 10;
          const fill = isPressed ? '#6B4F3E' : '#8B6F5E';

          return (
            <G key={country.code}>
              <Circle
                cx={x}
                cy={y}
                r={radius}
                fill={fill}
                stroke="#FFFFFF"
                strokeWidth={2}
                onPressIn={() => setPressedCountry(country.code)}
                onPressOut={() => {
                  setPressedCountry(null);
                  onCountrySelect(country);
                }}
              />
              <SvgText
                x={x}
                y={y + 4}
                fill="#FFFFFF"
                fontSize={10}
                fontWeight="bold"
                textAnchor="middle"
              >
                {country.activeRequests}
              </SvgText>
            </G>
          );
        })}
      </Svg>

      <View style={styles.legend}>
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>Tap a country to pray</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  svg: {
    width: '100%',
    aspectRatio: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 20,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B6F5E',
  },
  legendText: {
    fontSize: 13,
    color: '#5C3D2E',
    fontWeight: '500',
  },
});
