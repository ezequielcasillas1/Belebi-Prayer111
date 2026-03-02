import 'expo-dev-client';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from './app/providers';
import RootNavigator from './app/navigation/RootNavigator';
import ToastContainer from './app/components/ToastContainer';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import { View, StyleSheet, LogBox } from 'react-native';

LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'Unable to get the view config for default view',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <AppProviders>
            <View style={styles.container}>
              <StatusBar style="dark" />
              <RootNavigator />
              <ToastContainer />
            </View>
          </AppProviders>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
