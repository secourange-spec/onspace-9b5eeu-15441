// MODDESS TIPS - Notifications Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { notificationsService, Notification } from '@/services/notifications';
import { useAlert } from '@/template';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    const { data, error } = await notificationsService.getUserNotifications();
    if (error) {
      showAlert('Error', error);
    } else if (data) {
      setNotifications(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationsService.markAsRead(notificationId);
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = async () => {
    const { error } = await notificationsService.markAllAsRead();
    if (error) {
      showAlert('Error', error);
    } else {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'warning': return 'warning';
      case 'prediction': return 'sports-soccer';
      default: return 'info';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'prediction': return theme.colors.primary;
      default: return theme.colors.info;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.subtitle}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <MaterialIcons name="done-all" size={20} color={theme.colors.primary} />
            <Text style={styles.markAllText}>Mark all</Text>
          </Pressable>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-none" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You will be notified of new predictions</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <Pressable
              key={notification.id}
              style={[styles.notificationCard, !notification.read && styles.notificationUnread]}
              onPress={() => !notification.read && handleMarkAsRead(notification.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
                <MaterialIcons
                  name={getNotificationIcon(notification.type) as any}
                  size={24}
                  color={getNotificationColor(notification.type)}
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationDate}>
                  {new Date(notification.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  markAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
    ...theme.shadows.small,
  },
  notificationUnread: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.primary + '30',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  notificationMessage: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  notificationDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    gap: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.medium,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
});
