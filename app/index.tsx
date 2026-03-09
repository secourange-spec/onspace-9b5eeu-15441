// MODDESS TIPS - Root Index (ULTRA FIXED)
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthRouter } from '@/template';
import { Redirect, useRouter, useSegments } from 'expo-router';
import SplashScreen from '@/components/ui/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/constants/theme';

const ONBOARDING_KEY = '@moddess_onboarding_complete';

export default function RootScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkOnboarding();
    
    // Splash screen timer
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setOnboardingComplete(value === 'true');
    } catch (error) {
      setOnboardingComplete(false);
    }
  };

  useEffect(() => {
    if (!showSplash && onboardingComplete === false) {
      // Navigate to onboarding if not completed
      setTimeout(() => {
        router.replace('/onboarding');
      }, 100);
    }
  }, [showSplash, onboardingComplete]);

  // Show splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Still checking onboarding status
  if (onboardingComplete === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Onboarding not complete - will redirect via useEffect
  if (onboardingComplete === false) {
    return null;
  }

  // Onboarding complete - show AuthRouter
  return (
    <AuthRouter loginRoute="/login">
      <Redirect href="/(tabs)/free" />
    </AuthRouter>
  );
}
