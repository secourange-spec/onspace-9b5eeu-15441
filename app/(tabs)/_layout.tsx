// MODDESS TIPS - Tab Layout (Navigation par catégories)
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { theme } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isAdmin } = useUser();

  const tabBarStyle = {
    height: Platform.select({
      ios: insets.bottom + 65,
      android: insets.bottom + 65,
      default: 75,
    }),
    paddingTop: 10,
    paddingBottom: Platform.select({
      ios: insets.bottom + 10,
      android: insets.bottom + 10,
      default: 10,
    }),
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.medium,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="free"
        options={{
          title: 'Free',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="emoji-events" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vip"
        options={{
          title: 'VIP',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="workspace-premium" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="admin-panel-settings" size={size} color={color} />
          ),
        }}
      />
      {/* Pages cachées de la navigation */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="free-cote2"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="free-accumulation"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="vip-cote2"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="vip-cote5"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="vip-score"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="vip-htft"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
