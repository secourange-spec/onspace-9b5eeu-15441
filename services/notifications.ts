// MODDESS TIPS - Notifications Service (Without Auto-Notification for Predictions)
import { getSupabaseClient } from '@/template';
import { pushNotificationsService } from './pushNotifications';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'prediction';
  read: boolean;
  created_at: string;
}

const supabase = getSupabaseClient();

export const notificationsService = {
  // Get user notifications
  async getUserNotifications(): Promise<{ data: Notification[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Mark all as read
  async markAllAsRead(): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Create notification for all users (admin only) - GLOBAL NOTIFICATION (user_id = NULL)
  async notifyAllUsers(title: string, message: string, type: Notification['type']): Promise<{ error: string | null }> {
    try {
      // Create one global notification with user_id = NULL
      // RLS policy allows all users to see notifications where user_id IS NULL
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: null, // Global notification for all users
          title,
          message,
          type,
        });
      
      if (error) throw error;

      // Send push notification to all users
      await pushNotificationsService.sendPushToAll(title, message, { type });
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Get unread count
  async getUnreadCount(): Promise<{ count: number; error: string | null }> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);
      
      if (error) throw error;
      return { count: count || 0, error: null };
    } catch (error: any) {
      return { count: 0, error: error.message };
    }
  },

  // Get all notifications (admin only)
  async getAllNotifications(): Promise<{ data: Notification[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Delete notification (admin only)
  async deleteNotification(notificationId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Delete all notifications (admin only)
  async deleteAllNotifications(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
