import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SetupScreen from '../screens/SetupScreen';
import VerifyScreen from '../screens/VerifyScreen';
import HomeScreen from '../screens/HomeScreen';
import DirectoryScreen from '../screens/DirectoryScreen';
import PrayForNationScreen from '../screens/PrayForNationScreen';
import AutoModeScreen from '../screens/AutoModeScreen';
import PrayerProfileScreen from '../screens/PrayerProfileScreen';
import CountryDetailScreen from '../screens/CountryDetailScreen';
import LivePrayerRoomScreen from '../screens/LivePrayerRoomScreen';
import PlanPrayerScreen from '../screens/PlanPrayerScreen';
import PrayerListScreen from '../screens/PrayerListScreen';
import PrayersSentScreen from '../screens/PrayersSentScreen';
import CreateRequestScreen from '../screens/CreateRequestScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSafetyScreen from '../screens/HelpSafetyScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Setup: undefined;
  Verify: undefined;
  Home: undefined;
  Directory: undefined;
  PrayForNation: undefined;
  AutoMode: undefined;
  PrayerProfile: undefined;
  CountryDetail: { countryId: string };
  LivePrayerRoom: undefined;
  PlanPrayer: undefined;
  PrayerList: undefined;
  PrayersSent: undefined;
  CreateRequest: undefined;
  Settings: undefined;
  HelpSafety: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Setup" component={SetupScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Directory" component={DirectoryScreen} />
        <Stack.Screen name="PrayForNation" component={PrayForNationScreen} />
        <Stack.Screen name="AutoMode" component={AutoModeScreen} />
        <Stack.Screen name="PrayerProfile" component={PrayerProfileScreen} />
        <Stack.Screen name="CountryDetail" component={CountryDetailScreen} />
        <Stack.Screen name="LivePrayerRoom" component={LivePrayerRoomScreen} />
        <Stack.Screen name="PlanPrayer" component={PlanPrayerScreen} />
        <Stack.Screen name="PrayerList" component={PrayerListScreen} />
        <Stack.Screen name="PrayersSent" component={PrayersSentScreen} />
        <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="HelpSafety" component={HelpSafetyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
