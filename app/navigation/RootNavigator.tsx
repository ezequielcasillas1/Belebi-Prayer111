import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { useAuthStore } from '../features/auth/stores/authStore';
import DrawerNav from '../components/DrawerNav';

import { WelcomeScreen, SetupScreen, VerifyScreen } from '../features/auth';
import { HomeScreen, PrayerListScreen, PrayerProfileScreen, PrayersSentScreen, CreateRequestScreen } from '../features/prayers';
import { DirectoryScreen, PrayForNationScreen, CountryDetailScreen, LivePrayerRoomScreen } from '../features/nations';
import { AutoModeScreen, PlanPrayerScreen } from '../features/planning';
import { SettingsScreen, HelpSafetyScreen, TranslationTestScreen } from '../features/settings';
import { ChurchListScreen, ChurchDetailScreen, JoinChurchScreen, CreateChurchScreen, ChurchSettingsScreen } from '../features/churches';
import { ProfileScreen, TestimoniesScreen } from '../features/profile';

export type RootStackParamList = {
  Welcome: undefined;
  Setup: undefined;
  Verify: undefined;
  MainDrawer: undefined;
  Directory: { countryCode?: string } | undefined;
  PrayForNation: { countryCode: string };
  AutoMode: undefined;
  PrayerProfile: { requestId: string };
  CountryDetail: { countryCode: string };
  LivePrayerRoom: { countryCode: string };
  ChurchList: undefined;
  ChurchDetail: { churchId: string };
  JoinChurch: undefined;
  CreateChurch: undefined;
  ChurchSettings: { churchId: string };
  TranslationTest: undefined;
};

export type DrawerParamList = {
  HomeDrawer: undefined;
  ProfileDrawer: undefined;
  TestimoniesDrawer: undefined;
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
      id="MainDrawer"
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
      <Drawer.Screen name="ProfileDrawer" component={ProfileScreen} />
      <Drawer.Screen name="TestimoniesDrawer" component={TestimoniesScreen} />
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDF9F4' }}>
        <ActivityIndicator size="large" color="#6B4F3E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainDrawer" component={MainDrawer} />
            <Stack.Screen name="Directory" component={DirectoryScreen} />
            <Stack.Screen name="PrayForNation" component={PrayForNationScreen} />
            <Stack.Screen name="AutoMode" component={AutoModeScreen} />
            <Stack.Screen name="PrayerProfile" component={PrayerProfileScreen} />
            <Stack.Screen name="CountryDetail" component={CountryDetailScreen} />
            <Stack.Screen name="LivePrayerRoom" component={LivePrayerRoomScreen} />
            <Stack.Screen name="ChurchList" component={ChurchListScreen} />
            <Stack.Screen name="ChurchDetail" component={ChurchDetailScreen} />
            <Stack.Screen name="JoinChurch" component={JoinChurchScreen} />
            <Stack.Screen name="CreateChurch" component={CreateChurchScreen} />
            <Stack.Screen name="ChurchSettings" component={ChurchSettingsScreen} />
            <Stack.Screen name="TranslationTest" component={TranslationTestScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
