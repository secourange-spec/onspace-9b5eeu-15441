// MODDESS TIPS - Root Index (Auth Router with Splash)
import React, { useState, useEffect } from 'react';
import { AuthRouter } from '@/template';
import { Redirect } from 'expo-router';
import SplashScreen from '@/components/ui/SplashScreen';

export default function RootScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AuthRouter loginRoute="/login">
      <Redirect href="/(tabs)" />
    </AuthRouter>
  );
}
