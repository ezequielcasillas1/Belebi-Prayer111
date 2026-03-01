import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { useAppContext } from '../context/AppContext';
import DrawerNav from '../components/DrawerNav';

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
  MainDrawer: undefined;
  // Detail/modal screens outside the drawer
  Directory: { countryCode?: string } | undefined;
  PrayForNation: { countryCode: string };
  AutoMode: undefined;
  PrayerProfile: { requestId: string };
  CountryDetail: { countryCode: string };
  LivePrayerRoom: { countryCode: string };
};

export type DrawerParamList = {
  HomeDrawer: undefined;
  PrayerListDrawer: undefined;
  PlanPrayerDrawer: undefined;
  PrayersSentDrawer: undefined;
  CreateRequestDrawer: undefined;
  SettingsDrawer: undefined;
  HelpSafetyDrawer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerNav {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="HomeDrawer" component={HomeScreen} />
      <Drawer.Screen name="PrayerListDrawer" component={PrayerListScreen} />
      <Drawer.Screen name="PlanPrayerDrawer" component={PlanPrayerScreen} />
      <Drawer.Screen name="PrayersSentDrawer" component={PrayersSentScreen} />
      <Drawer.Screen name="CreateRequestDrawer" component={CreateRequestScreen} />
      <Drawer.Screen name="SettingsDrawer" component={SettingsScreen} />
      <Drawer.Screen name="HelpSafetyDrawer" component={HelpSafetyScreen} />
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { state } = useAppContext();

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDF9F4' }}>
        <ActivityIndicator size="large" color="#6B4F3E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!state.isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainDrawer" component={MainDrawer} />
            {/* Detail/modal screens that need to be outside the drawer */}
            <Stack.Screen name="Directory" component={DirectoryScreen} />
            <Stack.Screen name="PrayForNation" component={PrayForNationScreen} />
            <Stack.Screen name="AutoMode" component={AutoModeScreen} />
            <Stack.Screen name="PrayerProfile" component={PrayerProfileScreen} />
            <Stack.Screen name="CountryDetail" component={CountryDetailScreen} />
            <Stack.Screen name="LivePrayerRoom" component={LivePrayerRoomScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
