import 'expo-dev-client';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from './app/providers';
import RootNavigator from './app/navigation/RootNavigator';
import ToastContainer from './app/components/ToastContainer';
import { View, StyleSheet, LogBox } from 'react-native';

// TODO: Remove when upgrading to NativeWind v5 (stable release)
// These are LIBRARY-LEVEL warnings, not app code issues:
// 1. SafeAreaView: NativeWind v4's react-native-css-interop imports deprecated SafeAreaView
//    - Our code correctly uses react-native-safe-area-context
//    - Fixed in NativeWind v5 (currently preview, not production-ready)
// 2. ExpoLinearGradient: Known Expo SDK 55 + Fabric architecture warning
//    - Component works correctly, just triggers dev warning
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'Unable to get the view config for default view',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppProviders>
          <View style={styles.container}>
            <StatusBar style="dark" />
            <RootNavigator />
            <ToastContainer />
          </View>
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
