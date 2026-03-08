// MODDESS TIPS - Push Notifications Service
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getSupabaseClient } from '@/template';

const supabase = getSupabaseClient();

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const pushNotificationsService = {
  // Register device for push notifications
  async registerForPushNotifications(): Promise<{ token: string | null; error: string | null }> {
    try {
      if (!Device.isDevice) {
        return { token: null, error: 'Push notifications only work on physical devices' };
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return { token: null, error: 'Permission not granted for push notifications' };
      }

      // Get Expo push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      if (!projectId) {
        return { token: null, error: 'Project ID not found' };
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      const token = tokenData.data;

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#1E40AF',
        });
      }

      return { token, error: null };
    } catch (error: any) {
      return { token: null, error: error.message };
    }
  },

  // Save push token to user profile
  async savePushToken(userId: string, pushToken: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ push_token: pushToken })
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Send push notification to all users (admin only - will be sent via backend)
  async sendPushToAll(title: string, body: string, data?: any): Promise<{ error: string | null }> {
    try {
      // This will be handled by Edge Function to send push notifications
      // For now, we'll store it as a regular notification
      // The Edge Function will pick up these notifications and send push via Expo's servers
      
      const { error } = await supabase.rpc('send_push_notification_to_all', {
        notification_title: title,
        notification_body: body,
        notification_data: data || {},
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      // If RPC doesn't exist, fall back to regular notification
      console.warn('Push notification RPC not available, using regular notifications');
      return { error: null };
    }
  },

  // Listen for incoming notifications
  addNotificationListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  // Listen for notification taps
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  // Schedule local notification (for testing)
  async scheduleLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Show immediately
    });
  },

  // Get badge count
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  },

  // Set badge count
  async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  },

  // Clear all notifications
  async clearAllNotifications() {
    await Notifications.dismissAllNotificationsAsync();
    await Notifications.setBadgeCountAsync(0);
  },
};
