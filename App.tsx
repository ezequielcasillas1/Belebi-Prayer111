import './global.css';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './app/context/AppContext';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </AppProvider>
  );
}
