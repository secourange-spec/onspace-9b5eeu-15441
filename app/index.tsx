// MODDESS TIPS - Root Index (FIXED)
import React, { useState, useEffect } from 'react';
import { AuthRouter } from '@/template';
import { Redirect, useRouter } from 'expo-router';
import SplashScreen from '@/components/ui/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@moddess_onboarding_complete';

export default function RootScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkOnboarding();
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setOnboardingComplete(value === 'true');
    } catch {
      setOnboardingComplete(false);
    }
  };

  useEffect(() => {
    if (!showSplash && onboardingComplete === false) {
      router.replace('/onboarding');
    }
  }, [showSplash, onboardingComplete]);

  if (showSplash) return <SplashScreen />;
  if (onboardingComplete === null || onboardingComplete === false) return null;

  return (
    <AuthRouter loginRoute="/login">
      <Redirect href="/(tabs)" />
    </AuthRouter>
  );
}
