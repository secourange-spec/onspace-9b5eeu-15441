// MODDESS TIPS - Profile Screen (FIXED)
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/template';
import { VipBadge } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { profile, isVip, loading } = useUser();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
  if (loading || !profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.textMuted} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
    >
      {/* Header Card */}
      <LinearGradient
        colors={isVip ? [theme.colors.vipGradientStart, theme.colors.vipGradientEnd] : [theme.colors.surfaceLight, theme.colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileCard}
      >
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={48} color={isVip ? '#000' : theme.colors.textPrimary} />
        </View>
        <Text style={[styles.username, isVip && styles.usernameVip]}>
          {profile.username || profile.email.split('@')[0] || 'User'}
        </Text>
        <Text style={[styles.email, isVip && styles.emailVip]}>{profile.email}</Text>
        <View style={styles.badgeContainer}>
          <VipBadge isVip={isVip} size="large" />
        </View>
        {isVip && vipExpireDate && (
          <Text style={styles.vipExpire}>Expires on {vipExpireDate}</Text>
        )}
      </LinearGradient>

      {/* VIP Upgrade (FREE users only) */}
      {!isVip && (
        <Pressable
          style={styles.upgradeButton}
          onPress={() => router.push('/vip-pricing')}
        >
          <LinearGradient
            colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.upgradeGradient}
          >
            <MaterialIcons name="workspace-premium" size={24} color="#000" />
            <Text style={styles.upgradeText}>Upgrade to VIP</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#000" />
          </LinearGradient>
        </Pressable>
      )}

      {/* Links Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>
        
        <Pressable
          style={styles.linkCard}
          onPress={() => Linking.openURL(APP_CONFIG.telegram.admin)}
        >
          <View style={[styles.linkIcon, { backgroundColor: theme.colors.info + '20' }]}>
            <MaterialIcons name="support-agent" size={24} color={theme.colors.info} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Contact Admin</Text>
            <Text style={styles.linkSubtitle}>Support & VIP subscription</Text>
          </View>
          <MaterialIcons name="open-in-new" size={20} color={theme.colors.textMuted} />
        </Pressable>

        <Pressable
          style={styles.linkCard}
          onPress={() => Linking.openURL(APP_CONFIG.telegram.channel)}
        >
          <View style={[styles.linkIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            <MaterialIcons name="groups" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Official Channel</Text>
            <Text style={styles.linkSubtitle}>Join the community</Text>
          </View>
          <MaterialIcons name="open-in-new" size={20} color={theme.colors.textMuted} />
        </Pressable>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <VipBadge isVip={isVip} size="small" />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{profile.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member since</Text>
            <Text style={styles.infoValue}>
              {profile.created_at
                ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={20} color={theme.colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  profileCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.large,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  username: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  usernameVip: {
    color: '#000',
  },
  email: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  emailVip: {
    color: '#000',
    opacity: 0.8,
  },
  badgeContainer: {
    marginBottom: theme.spacing.xs,
  },
  vipExpire: {
    fontSize: theme.fontSize.xs,
    color: '#000',
    opacity: 0.7,
  },
  upgradeButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  upgradeText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
    flex: 1,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.xs,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  linkIcon: {
    width: 48,
    height: 48,
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
  },
  linkSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  infoValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
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
    borderColor: theme.colors.error + '40',
  },
  logoutButtonPressed: {
    opacity: 0.7,
  },
  logoutText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.error,
  },
});
