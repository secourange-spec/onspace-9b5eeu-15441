// MODDESS TIPS - Professional Profile Screen v2.0
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/template';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get user data
  const { profile, isVip, loading, refreshProfile } = useUser();
  const { logout } = useAuth();

  // Refresh profile when screen appears
  useEffect(() => {
    const refresh = async () => {
      setIsRefreshing(true);
      await refreshProfile();
      setIsRefreshing(false);
    };
    refresh();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleContactAdmin = () => {
    Linking.openURL(APP_CONFIG.telegram.admin);
  };

  const handleJoinChannel = () => {
    Linking.openURL(APP_CONFIG.telegram.channel);
  };

  const handleUpgrade = () => {
    router.push('/vip-pricing');
  };

  // Calculate VIP expiration
  const vipExpireDate = profile?.vip_expire_date
    ? new Date(profile.vip_expire_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : '-';

  // Loading state
  if (loading || isRefreshing) {
    return (
      <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Error state (no profile)
  if (!profile) {
    return (
      <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
        <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorTitle}>Profile Not Found</Text>
        <Text style={styles.errorSubtitle}>Unable to load your profile</Text>
        <Pressable style={styles.retryButton} onPress={refreshProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // Success state - Show profile
  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={[styles.headerCard, isVip && styles.headerCardVip]}>
        <View style={[styles.avatarCircle, isVip && styles.avatarCircleVip]}>
          <MaterialIcons name="person" size={48} color={isVip ? '#FFF' : theme.colors.primary} />
        </View>
        
        <Text style={[styles.userName, isVip && styles.userNameVip]}>
          {profile.username || profile.email.split('@')[0] || 'User'}
        </Text>
        
        <Text style={[styles.userEmail, isVip && styles.userEmailVip]}>
          {profile.email}
        </Text>

        {/* Status Badge */}
        <View style={[styles.statusBadge, isVip && styles.statusBadgeVip]}>
          <MaterialIcons 
            name={isVip ? 'workspace-premium' : 'person-outline'} 
            size={16} 
            color={isVip ? '#FFF' : theme.colors.textMuted} 
          />
          <Text style={[styles.statusText, isVip && styles.statusTextVip]}>
            {isVip ? 'VIP Member' : 'Free Member'}
          </Text>
        </View>

        {/* VIP Expiration */}
        {isVip && vipExpireDate && (
          <Text style={styles.vipExpiration}>Valid until {vipExpireDate}</Text>
        )}
      </View>

      {/* VIP Upgrade Banner (FREE users only) */}
      {!isVip && (
        <Pressable
          style={({ pressed }) => [styles.upgradeCard, pressed && styles.upgradeCardPressed]}
          onPress={handleUpgrade}
        >
          <View style={styles.upgradeIcon}>
            <MaterialIcons name="workspace-premium" size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>Upgrade to VIP</Text>
            <Text style={styles.upgradeSubtitle}>Unlock exclusive predictions</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={20} color={theme.colors.textMuted} />
        </Pressable>
      )}

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="email" size={20} color={theme.colors.textMuted} />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue} numberOfLines={1}>
              {profile.email}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="calendar-today" size={20} color={theme.colors.textMuted} />
              <Text style={styles.infoLabel}>Member Since</Text>
            </View>
            <Text style={styles.infoValue}>{memberSince}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons 
                name={isVip ? 'verified' : 'verified-user'} 
                size={20} 
                color={isVip ? theme.colors.primary : theme.colors.textMuted} 
              />
              <Text style={styles.infoLabel}>Status</Text>
            </View>
            <Text style={[styles.infoValue, isVip && styles.infoValueVip]}>
              {isVip ? 'VIP' : 'Free'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Community</Text>
        
        <Pressable
          style={({ pressed }) => [styles.linkCard, pressed && styles.linkCardPressed]}
          onPress={handleContactAdmin}
        >
          <View style={[styles.linkIcon, { backgroundColor: theme.colors.primary + '15' }]}>
            <MaterialIcons name="support-agent" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Contact Admin</Text>
            <Text style={styles.linkSubtitle}>VIP subscriptions & support</Text>
          </View>
          <MaterialIcons name="open-in-new" size={20} color={theme.colors.textMuted} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.linkCard, pressed && styles.linkCardPressed]}
          onPress={handleJoinChannel}
        >
          <View style={[styles.linkIcon, { backgroundColor: theme.colors.info + '15' }]}>
            <MaterialIcons name="groups" size={24} color={theme.colors.info} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Official Channel</Text>
            <Text style={styles.linkSubtitle}>Join our community</Text>
          </View>
          <MaterialIcons name="open-in-new" size={20} color={theme.colors.textMuted} />
        </Pressable>
      </View>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={20} color={theme.colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      {/* App Version */}
      <Text style={styles.versionText}>Version {APP_CONFIG.version}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  
  // Loading & Error states
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
  errorTitle: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  errorSubtitle: {
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  retryButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: '#FFF',
  },

  // Header Card
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  headerCardVip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
    ...theme.shadows.blue,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: theme.colors.border,
  },
  avatarCircleVip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  userNameVip: {
    color: '#FFF',
  },
  userEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  userEmailVip: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusBadgeVip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
  },
  statusTextVip: {
    color: '#FFF',
  },
  vipExpiration: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Upgrade Card
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.blue,
  },
  upgradeCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  upgradeIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  upgradeSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },

  // Section
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },

  // Info Card
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
    maxWidth: '50%',
    textAlign: 'right',
  },
  infoValueVip: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },

  // Link Cards
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  linkCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  linkIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  linkSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error + '40',
  },
  logoutButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  logoutText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.error,
  },

  // Version
  versionText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
