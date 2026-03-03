// MODDESS TIPS - Root Layout
import { AlertProvider, AuthProvider } from '@/template';
import { UserProvider } from '@/contexts/UserContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <UserProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen 
                name="vip-pricing" 
                options={{ 
                  presentation: 'modal',
                  headerShown: true,
                  headerTitle: 'Devenir VIP',
                  headerStyle: { backgroundColor: '#0a0a0a' },
                  headerTintColor: '#FFD700',
                }}
              />
            </Stack>
          </UserProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
