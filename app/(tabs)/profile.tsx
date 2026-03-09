// MODDESS TIPS - Profile Screen (Professional & Sophisticated Design)
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/template';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { profile, isVip, loading, refreshProfile } = useUser();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Refresh profile when screen opens
  useEffect(() => {
    refreshProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

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
        <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="error-outline" size={48} color={theme.colors.error} />
        <Text style={styles.loadingText}>Failed to load profile</Text>
        <Pressable style={styles.retryButton} onPress={refreshProfile}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with gradient */}
      <LinearGradient
        colors={isVip ? [theme.colors.vipGradientStart, theme.colors.vipGradientEnd] : [theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{(profile.username || profile.email.split('@')[0]).charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.headerName}>{profile.username || profile.email.split('@')[0]}</Text>
        <Text style={styles.headerEmail}>{profile.email}</Text>
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, isVip ? styles.statusVip : styles.statusFree]}>
          <MaterialIcons name={isVip ? "workspace-premium" : "person"} size={16} color="#FFF" />
          <Text style={styles.statusText}>{isVip ? "VIP MEMBER" : "FREE ACCOUNT"}</Text>
        </View>

        {/* VIP Expiry */}
        {isVip && vipExpireDate && (
          <Text style={styles.vipExpiry}>Valid until {vipExpireDate}</Text>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Upgrade Card (FREE users only) */}
        {!isVip && (
          <Pressable
            style={styles.upgradeCard}
            onPress={() => router.push('/vip-pricing')}
          >
            <LinearGradient
              colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upgradeGradient}
            >
              <MaterialIcons name="workspace-premium" size={32} color="#000" />
              <Text style={styles.upgradeTitle}>Unlock VIP Access</Text>
              <Text style={styles.upgradeDescription}>
                Get exclusive predictions with higher success rates
              </Text>
              <View style={styles.upgradeArrow}>
                <MaterialIcons name="arrow-forward" size={20} color="#000" />
              </View>
            </LinearGradient>
          </Pressable>
        )}

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="email" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="shield" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Account Type</Text>
                <Text style={styles.infoValue}>{isVip ? "VIP Premium" : "Free Account"}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="calendar-today" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Community</Text>
          
          <Pressable
            style={styles.linkCard}
            onPress={() => Linking.openURL(APP_CONFIG.telegram.admin)}
          >
            <View style={[styles.linkIconContainer, { backgroundColor: theme.colors.info + '15' }]}>
              <MaterialIcons name="support-agent" size={28} color={theme.colors.info} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Contact Admin</Text>
              <Text style={styles.linkDescription}>Get help & VIP subscription</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textMuted} />
          </Pressable>

          <Pressable
            style={styles.linkCard}
            onPress={() => Linking.openURL(APP_CONFIG.telegram.channel)}
          >
            <View style={[styles.linkIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
              <MaterialIcons name="groups" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Official Channel</Text>
              <Text style={styles.linkDescription}>Join our Telegram community</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textMuted} />
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  retryText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  headerGradient: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
    ...theme.shadows.large,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  headerName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    gap: 6,
  },
  statusVip: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  statusFree: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  vipExpiry: {
    fontSize: theme.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  upgradeCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.gold,
  },
  upgradeGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
    marginTop: theme.spacing.sm,
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: theme.fontSize.sm,
    color: '#000',
    opacity: 0.8,
    textAlign: 'center',
  },
  upgradeArrow: {
    marginTop: theme.spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    alignItems: 'center',
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
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
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
  linkIconContainer: {
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
  linkDescription: {
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
    borderWidth: 2,
    borderColor: theme.colors.error + '30',
    marginTop: theme.spacing.md,
  },
  logoutButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  logoutText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.error,
  },
});
