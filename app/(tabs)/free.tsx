// MODDESS TIPS - Free Categories
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function FreeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const categories = [
    {
      id: 'cote_2_free',
      title: 'Côte 2',
      description: 'Pronostics avec côte autour de 2.00',
      icon: 'emoji-events',
      route: '/(tabs)/free-cote2',
      color: '#3B82F6',
    },
    {
      id: 'accumulation_free',
      title: 'Accumulation',
      description: 'Paris combinés à fortes côtes',
      icon: 'layers',
      route: '/(tabs)/free-accumulation',
      color: '#8B5CF6',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pronostics Free</Text>
          <Text style={styles.subtitle}>Accès gratuit pour tous</Text>
        </View>
        <View style={styles.freeBadge}>
          <MaterialIcons name="lock-open" size={20} color={theme.colors.success} />
          <Text style={styles.freeBadgeText}>FREE</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category, index) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.categoryCard,
              pressed && styles.categoryCardPressed,
            ]}
            onPress={() => router.push(category.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <MaterialIcons name={category.icon as any} size={32} color={category.color} />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color={theme.colors.textMuted} />
          </Pressable>
        ))}

        {/* VIP Upgrade Banner */}
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
            <MaterialIcons name="workspace-premium" size={48} color="#000" />
            <Text style={styles.upgradeTitle}>Passer au VIP</Text>
            <Text style={styles.upgradeDescription}>
              Débloquez 4 catégories VIP exclusives avec des pronostics premium
            </Text>
            <View style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Voir les offres</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#000" />
            </View>
          </LinearGradient>
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
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.success + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  freeBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
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
  upgradeCard: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.gold,
  },
  upgradeGradient: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  upgradeDescription: {
    fontSize: theme.fontSize.sm,
    color: '#000',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  upgradeButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
});
