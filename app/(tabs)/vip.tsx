// MODDESS TIPS - VIP Categories (English + Better Icons)
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function VipScreen() {
  const { isVip } = useUser();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const categories = [
    {
      id: 'cote_2_vip',
      title: 'Odds 2 VIP',
      description: 'Safe predictions with odds ~2.00',
      icon: 'verified',
      route: '/(tabs)/vip-cote2',
      color: '#F59E0B',
    },
    {
      id: 'cote_5_vip',
      title: 'Odds 5 VIP',
      description: 'Premium high-odds predictions',
      icon: 'auto-awesome',
      route: '/(tabs)/vip-cote5',
      color: '#EF4444',
    },
    {
      id: 'score_exact_vip',
      title: 'Correct Score',
      description: 'Precise score predictions',
      icon: 'adjust',
      route: '/(tabs)/vip-score',
      color: '#8B5CF6',
    },
    {
      id: 'ht_ft_vip',
      title: 'HT/FT',
      description: 'Half-time / Full-time',
      icon: 'compare-arrows',
      route: '/(tabs)/vip-htft',
      color: '#10B981',
    },
  ];

  if (!isVip) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>VIP Predictions</Text>
          <MaterialIcons name="lock" size={24} color={theme.colors.error} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <LinearGradient
            colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.lockedCard}
          >
            <MaterialIcons name="lock" size={64} color="#000" />
            <Text style={styles.lockedTitle}>VIP Content Locked</Text>
            <Text style={styles.lockedDescription}>
              Upgrade to VIP to access 4 exclusive premium prediction categories
            </Text>
            <Pressable
              style={styles.unlockButton}
              onPress={() => router.push('/vip-pricing')}
            >
              <Text style={styles.unlockButtonText}>Unlock Now</Text>
              <MaterialIcons name="arrow-forward" size={20} color={theme.colors.primary} />
            </Pressable>
          </LinearGradient>

          {/* Preview categories */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Available VIP Categories:</Text>
            {categories.map((category) => (
              <View key={category.id} style={styles.previewCard}>
                <View style={[styles.previewIcon, { backgroundColor: category.color + '20' }]}>
                  <MaterialIcons name={category.icon as any} size={28} color={category.color} />
                </View>
                <View style={styles.previewContent}>
                  <Text style={styles.previewCardTitle}>{category.title}</Text>
                  <Text style={styles.previewCardDescription}>{category.description}</Text>
                </View>
                <MaterialIcons name="lock" size={20} color={theme.colors.textMuted} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* VIP Header */}
      <LinearGradient
        colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.vipHeader}
      >
        <View>
          <Text style={styles.vipTitle}>VIP Predictions</Text>
          <Text style={styles.vipSubtitle}>Exclusive Premium Access</Text>
        </View>
        <View style={styles.vipBadge}>
          <MaterialIcons name="workspace-premium" size={20} color="#000" />
          <Text style={styles.vipBadgeText}>VIP</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.categoryCard,
              pressed && styles.categoryCardPressed,
            ]}
            onPress={() => router.push(category.route as any)}
          >
            <LinearGradient
              colors={[category.color + '20', category.color + '10']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <MaterialIcons name={category.icon as any} size={36} color={category.color} />
            </LinearGradient>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color={theme.colors.textMuted} />
          </Pressable>
        ))}
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
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  vipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  vipTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  vipSubtitle: {
    fontSize: theme.fontSize.sm,
    color: '#000',
    opacity: 0.8,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#000',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  vipBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  categoryCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  lockedCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.gold,
  },
  lockedTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  lockedDescription: {
    fontSize: theme.fontSize.sm,
    color: '#000',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  unlockButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  previewContainer: {
    gap: theme.spacing.sm,
  },
  previewTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    opacity: 0.6,
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  previewContent: {
    flex: 1,
  },
  previewCardTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  previewCardDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
});
