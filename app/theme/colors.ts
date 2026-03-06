// Belebi Prayer Color Theme
// Primary: radial-gradient(circle, #faf7f0 0%, #c5ae91 100%)
// Secondary: linear-gradient(180deg, #AF6E4D 0%, #FFDAB9 100%)

export const colors = {
  // Primary palette (warm cream to tan)
  primary: {
    light: '#faf7f0',      // Cream (gradient start)
    medium: '#e8dfd2',     // Mid-tone
    dark: '#c5ae91',       // Warm tan (gradient end)
  },

  // Secondary palette (terracotta to peach)
  secondary: {
    dark: '#AF6E4D',       // Terracotta (gradient start / buttons)
    medium: '#C98B6A',     // Mid terracotta
    light: '#FFDAB9',      // Peach (gradient end)
  },

  // Text colors
  text: {
    primary: '#1C0F0A',    // Dark brown (headings)
    secondary: '#5C3D2E',  // Medium brown (body)
    muted: '#8B7355',      // Muted brown (hints)
    light: '#FFFFFF',      // White (on dark backgrounds)
  },

  // UI colors
  ui: {
    background: '#faf7f0', // Main background
    card: '#FFFFFF',       // Card backgrounds
    border: '#d4c4b0',     // Border color
    borderLight: '#e8dfd2',// Light border
    divider: '#e8dfd2',    // Divider lines
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Semantic colors
  success: {
    bg: '#E8F5EE',
    border: '#A8D5BE',
    text: '#1A4731',
    icon: '#22C55E',
  },
  warning: {
    bg: '#FFF8E7',
    border: '#F5D98A',
    text: '#7A5000',
    icon: '#F59E0B',
  },
  error: {
    bg: '#FEE2E2',
    border: '#FECACA',
    text: '#7A1E1E',
    icon: '#EF4444',
  },
  info: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF',
    icon: '#3B82F6',
  },

  // Button colors
  button: {
    primary: '#AF6E4D',
    primaryPressed: '#8B5A3D',
    primaryDisabled: '#d4a989',
    secondary: 'transparent',
    secondaryBorder: '#AF6E4D',
    ghost: 'transparent',
    destructive: '#d4183d',
  },

  // Badge colors
  badge: {
    denomination: { bg: '#faf7f0', border: '#d4c4b0', text: '#5C3D2E' },
    emergency: { bg: '#FEE2E2', border: '#FECACA', text: '#7A1E1E' },
    country: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
  },

  // Accent colors
  accent: {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    teal: '#14B8A6',
  },
};

// Gradient configurations for expo-linear-gradient
export const gradients = {
  primary: {
    colors: ['#faf7f0', '#e8dfd2', '#c5ae91'],
    locations: [0, 0.5, 1],
  },
  secondary: {
    colors: ['#AF6E4D', '#C98B6A', '#FFDAB9'],
    locations: [0, 0.5, 1],
  },
  secondaryReverse: {
    colors: ['#FFDAB9', '#C98B6A', '#AF6E4D'],
    locations: [0, 0.5, 1],
  },
  card: {
    colors: ['#FFFFFF', '#faf7f0'],
    locations: [0, 1],
  },
};
