// MODDESS TIPS - Professional Profile Screen v3
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { useAuth } from '@/template';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usersService, UserProfile } from '@/services/users';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: loadError } = await usersService.getCurrentUserProfile(user.id);
      
      if (loadError) {
        setError(loadError);
        setProfile(null);
      } else if (data) {
        setProfile(data);
        setError(null);
      } else {
        setError('No profile data');
        setProfile(null);
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const handleLogout = async () => {
    const { error: logoutError } = await logout();
    if (logoutError) {
      setError(logoutError);
    }
  };

  const isVip = profile ? usersService.isVipActive(profile) : false;
  const vipExpireDate = profile?.vip_expire_date
    ? new Date(profile.vip_expire_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorTitle}>Unable to load profile</Text>
        <Text style={styles.errorText}>{error || 'No profile data'}</Text>
        <Pressable style={styles.retryButton} onPress={loadProfile}>
          <MaterialIcons name="refresh" size={20} color="#FFF" />
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Gradient */}
      <LinearGradient
        colors={isVip ? [theme.colors.vipGradientStart, theme.colors.vipGradientEnd] : [theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={56} color="#FFF" />
        </View>
        <Text style={styles.username}>
          {profile.username || profile.email.split('@')[0] || 'User'}
        </Text>
        <Text style={styles.email}>{profile.email}</Text>
        
        {/* VIP Badge */}
        <View style={[styles.statusBadge, isVip ? styles.vipBadge : styles.freeBadge]}>
          <MaterialIcons 
            name={isVip ? "workspace-premium" : "person"} 
            size={18} 
            color={isVip ? "#000" : "#FFF"} 
          />
          <Text style={[styles.statusText, isVip ? styles.vipText : styles.freeText]}>
            {isVip ? 'VIP Member' : 'FREE Member'}
          </Text>
        </View>

        {isVip && vipExpireDate && (
          <Text style={styles.vipExpire}>Valid until {vipExpireDate}</Text>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* VIP Upgrade (FREE users only) */}
        {!isVip && (
          <Pressable
            style={({ pressed }) => [
              styles.upgradeCard,
              pressed && styles.upgradeCardPressed,
            ]}
            onPress={() => router.push('/vip-pricing')}
          >
            <LinearGradient
              colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upgradeGradient}
            >
              <MaterialIcons name="workspace-premium" size={40} color="#000" />
              <Text style={styles.upgradeTitle}>Upgrade to VIP</Text>
              <Text style={styles.upgradeSubtitle}>
                Unlock 4 exclusive categories with premium predictions
              </Text>
              <View style={styles.upgradePricing}>
                <Text style={styles.upgradePrice}>From $25/week</Text>
              </View>
              <View style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>View Plans</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#000" />
              </View>
            </LinearGradient>
          </Pressable>
        )}

        {/* Account Info Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="email" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="verified-user" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Account Status</Text>
                <View style={styles.statusRow}>
                  <MaterialIcons 
                    name={isVip ? "workspace-premium" : "person"} 
                    size={16} 
                    color={isVip ? theme.colors.primary : theme.colors.textMuted} 
                  />
                  <Text style={[styles.infoValue, isVip && styles.infoValueVip]}>
                    {isVip ? 'VIP Member' : 'FREE Member'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="calendar-today" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Links Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Community</Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.linkCard,
              pressed && styles.linkCardPressed,
            ]}
            onPress={() => Linking.openURL(APP_CONFIG.telegram.admin)}
          >
            <View style={[styles.linkIcon, { backgroundColor: theme.colors.info + '15' }]}>
              <MaterialIcons name="support-agent" size={28} color={theme.colors.info} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Contact Admin</Text>
              <Text style={styles.linkSubtitle}>24/7 Support & VIP subscription help</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={18} color={theme.colors.textMuted} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.linkCard,
              pressed && styles.linkCardPressed,
            ]}
            onPress={() => Linking.openURL(APP_CONFIG.telegram.channel)}
          >
            <View style={[styles.linkIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <MaterialIcons name="groups" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Join Our Channel</Text>
              <Text style={styles.linkSubtitle}>Get latest updates and predictions</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={18} color={theme.colors.textMuted} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={22} color={theme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.versionText}>v2.0 · {APP_CONFIG.appName}</Text>
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
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
    ...theme.shadows.large,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  username: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: 6,
  },
  vipBadge: {
    backgroundColor: '#FFF',
  },
  freeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  vipText: {
    color: '#000',
  },
  freeText: {
    color: '#FFF',
  },
  vipExpire: {
    fontSize: theme.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
    marginTop: -theme.spacing.lg,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  upgradeCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.gold,
  },
  upgradeCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  upgradeGradient: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  upgradeTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  upgradeSubtitle: {
    fontSize: theme.fontSize.sm,
    color: '#000',
    opacity: 0.8,
    textAlign: 'center',
  },
  upgradePricing: {
    marginTop: theme.spacing.xs,
  },
  upgradePrice: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: '#000',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: 6,
    marginTop: theme.spacing.sm,
  },
  upgradeButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
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
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  infoValueVip: {
    color: theme.colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  linkCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  linkIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.error + '30',
    ...theme.shadows.small,
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
  versionText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },
  errorTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 6,
    ...theme.shadows.blue,
  },
  retryText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: '#FFF',
  },
});
