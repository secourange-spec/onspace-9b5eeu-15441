// MODDESS TIPS - History Detail by Section
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { PredictionCard } from '@/components';
import { predictionsService, HistoryEntry } from '@/services/predictions';
import { useAlert } from '@/template';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function HistoryDetailScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();
  
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'won' | 'lost'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    if (!section) return;
    const { data, error } = await predictionsService.getHistoryBySection(section, filter);
    if (error) {
      showAlert('Error', error);
    } else if (data) {
      setHistory(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [section, filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const wonCount = history.filter(h => h.status === 'won').length;
  const lostCount = history.filter(h => h.status === 'lost').length;
  const winRate = history.length > 0 ? ((wonCount / history.length) * 100).toFixed(1) : '0';

  const sectionTitle = section?.replace('_', ' ').toUpperCase() || 'Historique';

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: sectionTitle,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.textPrimary,
          headerBackTitleVisible: false,
        }}
      />
      <View style={[styles.container, { paddingTop: 0 }]}>
        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <MaterialIcons name="bar-chart" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>{winRate}%</Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />
            <Text style={styles.statValue}>{wonCount}</Text>
            <Text style={styles.statLabel}>Won</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="cancel" size={24} color={theme.colors.error} />
            <Text style={styles.statValue}>{lostCount}</Text>
            <Text style={styles.statLabel}>Lost</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <Pressable
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, filter === 'won' && styles.filterChipActive]}
            onPress={() => setFilter('won')}
          >
            <MaterialIcons name="check-circle" size={16} color={filter === 'won' ? '#000' : theme.colors.textMuted} />
            <Text style={[styles.filterText, filter === 'won' && styles.filterTextActive]}>Won</Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, filter === 'lost' && styles.filterChipActive]}
            onPress={() => setFilter('lost')}
          >
            <MaterialIcons name="cancel" size={16} color={filter === 'lost' ? '#000' : theme.colors.textMuted} />
            <Text style={[styles.filterText, filter === 'lost' && styles.filterTextActive]}>Lost</Text>
          </Pressable>
        </View>

        {/* List */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
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
          ) : history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="history" size={48} color={theme.colors.textMuted} />
              <Text style={styles.emptyText}>No history</Text>
            </View>
          ) : (
            history.map((entry) => (
              <PredictionCard key={entry.id} prediction={entry} />
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  stats: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  filters: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  filterChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
  },
  filterTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
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
});
