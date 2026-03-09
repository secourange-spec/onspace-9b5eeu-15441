// MODDESS TIPS - VIP Predictions (Improved Icons)
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function VipScreen() {
  const { isVip } = useUser();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const categories = [
    {
      id: 'cote_2_vip',
      title: 'Odds 2 VIP',
      description: 'Secure bets with professional analysis',
      icon: 'verified-user',
      route: '/vip-cote2',
      color: '#3B82F6',
    },
    {
      id: 'cote_5_vip',
      title: 'Odds 5 VIP',
      description: 'High-value predictions with great returns',
      icon: 'stars',
      route: '/vip-cote5',
      color: '#8B5CF6',
    },
    {
      id: 'score_exact_vip',
      title: 'Correct Score',
      description: 'Precise score predictions',
      icon: 'military-tech',
      route: '/vip-score',
      color: '#EF4444',
    },
    {
      id: 'ht_ft_vip',
      title: 'HT/FT',
      description: 'Half-time/Full-time predictions',
      icon: 'schedule',
      route: '/vip-htft',
      color: '#10B981',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>VIP Predictions</Text>
          <Text style={styles.subtitle}>Exclusive premium content</Text>
        </View>
        <MaterialIcons name="workspace-premium" size={24} color="#FFF" />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
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
              <MaterialIcons name="workspace-premium" size={32} color="#FFF" />
              <Text style={styles.upgradeTitle}>Unlock VIP Access</Text>
              <Text style={styles.upgradeDescription}>
                Get exclusive predictions with higher success rates
              </Text>
              <View style={styles.upgradeArrow}>
                <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
              </View>
            </LinearGradient>
          </Pressable>
        )}

        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.categoryCard,
              pressed && styles.categoryCardPressed,
              !isVip && styles.categoryCardLocked,
            ]}
            onPress={() => {
              if (isVip) {
                router.push(category.route as any);
              } else {
                router.push('/vip-pricing');
              }
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <MaterialIcons name={category.icon as any} size={32} color={category.color} />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            {!isVip ? (
              <MaterialIcons name="lock" size={20} color={theme.colors.textMuted} />
            ) : (
              <MaterialIcons name="arrow-forward-ios" size={20} color={theme.colors.textMuted} />
            )}
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
    ...theme.shadows.medium,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  upgradeCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.large,
  },
  upgradeGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
    marginTop: theme.spacing.sm,
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  upgradeArrow: {
    marginTop: theme.spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
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
  categoryCardLocked: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
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
});
