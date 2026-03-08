// MODDESS TIPS - History Screen (English)
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const { isVip } = useUser();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const freeCategories = [
    {
      id: 'cote_2_free',
      title: 'Odds 2',
      icon: 'emoji-events',
      color: '#3B82F6',
    },
    {
      id: 'accumulation_free',
      title: 'Accumulator',
      icon: 'layers',
      color: '#8B5CF6',
    },
  ];

  const vipCategories = [
    {
      id: 'cote_2_vip',
      title: 'Odds 2 VIP',
      icon: 'stars',
      color: '#F59E0B',
    },
    {
      id: 'cote_5_vip',
      title: 'Odds 5 VIP',
      icon: 'workspace-premium',
      color: '#EF4444',
    },
    {
      id: 'score_exact_vip',
      title: 'Correct Score',
      icon: 'scoreboard',
      color: '#8B5CF6',
    },
    {
      id: 'ht_ft_vip',
      title: 'HT/FT',
      icon: 'schedule',
      color: '#10B981',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Past prediction results</Text>
        </View>
        <MaterialIcons name="history" size={24} color={theme.colors.primary} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Free Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="lock-open" size={20} color={theme.colors.success} />
            <Text style={styles.sectionTitle}>Free Categories</Text>
          </View>
          {freeCategories.map((category) => (
            <Pressable
              key={category.id}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.categoryCardPressed,
              ]}
              onPress={() => router.push(`/history-detail?section=${category.id}` as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                <MaterialIcons name={category.icon as any} size={28} color={category.color} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <MaterialIcons name="arrow-forward-ios" size={18} color={theme.colors.textMuted} />
            </Pressable>
          ))}
        </View>

        {/* VIP Section - Accessible to all to motivate subscriptions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="workspace-premium" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>VIP Categories</Text>
            {!isVip && (
              <View style={styles.motivationBadge}>
                <Text style={styles.motivationText}>View past results</Text>
              </View>
            )}
          </View>
          {vipCategories.map((category) => (
            <Pressable
              key={category.id}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.categoryCardPressed,
              ]}
              onPress={() => router.push(`/history-detail?section=${category.id}` as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                <MaterialIcons name={category.icon as any} size={28} color={category.color} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <MaterialIcons name="arrow-forward-ios" size={18} color={theme.colors.textMuted} />
            </Pressable>
          ))}
        </View>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  categoryCard: {
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
  categoryCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  categoryTitle: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  motivationBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginLeft: 'auto',
  },
  motivationText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
});
