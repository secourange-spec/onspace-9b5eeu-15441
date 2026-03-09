// MODDESS TIPS - History Detail Screen (Fixed Navigation + Auto-Refresh)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { predictionsService, HistoryEntry } from '@/services/predictions';
import { useAlert } from '@/template';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryDetailScreen() {
  const { section } = useLocalSearchParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const sectionTitles: { [key: string]: string } = {
    cote_2_free: 'Odds 2 - Free',
    accumulation_free: 'Accumulator - Free',
    cote_2_vip: 'Odds 2 - VIP',
    cote_5_vip: 'Odds 5 - VIP',
    score_exact_vip: 'Correct Score - VIP',
    ht_ft_vip: 'HT/FT - VIP',
  };

  const loadHistory = async () => {
    const { data, error } = await predictionsService.getHistoryBySection(section as string);
    if (error) {
      showAlert('Error', error);
    } else if (data) {
      setHistory(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [section]);

  // Auto-refresh when screen becomes active
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [section])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const wonCount = history.filter(h => h.status === 'won').length;
  const lostCount = history.filter(h => h.status === 'lost').length;
  const successRate = history.length > 0 
    ? ((wonCount / history.length) * 100).toFixed(1) 
    : '0.0';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/history')}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{sectionTitles[section as string] || 'History'}</Text>
          <Text style={styles.subtitle}>{history.length} matches</Text>
        </View>
        <Pressable style={styles.refreshButton} onPress={onRefresh}>
          <MaterialIcons name="refresh" size={24} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />
          <Text style={styles.statValue}>{wonCount}</Text>
          <Text style={styles.statLabel}>Won</Text>
        </View>
        <View style={styles.statBox}>
          <MaterialIcons name="cancel" size={24} color={theme.colors.error} />
          <Text style={styles.statValue}>{lostCount}</Text>
          <Text style={styles.statLabel}>Lost</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxHighlight]}>
          <MaterialIcons name="trending-up" size={24} color="#FFF" />
          <Text style={[styles.statValue, { color: '#FFF' }]}>{successRate}%</Text>
          <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.9)' }]}>Success Rate</Text>
        </View>
      </View>

      {/* History List */}
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
            <Text style={styles.emptyText}>No history available</Text>
          </View>
        ) : (
          history.map((entry) => (
            <View key={entry.id} style={styles.historyCard}>
              {entry.championship && (
                <Text style={styles.championship}>{entry.championship}</Text>
              )}
              <Text style={styles.match}>{entry.match}</Text>
              <Text style={styles.bet}>Bet: {entry.bet}</Text>
              <Text style={styles.odds}>Odds: {entry.odds}</Text>
              {entry.match_date && (
                <Text style={styles.date}>
                  {new Date(entry.match_date).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              )}
              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, entry.status === 'won' ? styles.statusWon : styles.statusLost]}>
                  <MaterialIcons 
                    name={entry.status === 'won' ? 'check' : 'close'} 
                    size={16} 
                    color="#FFF" 
                  />
                  <Text style={styles.statusText}>{entry.status === 'won' ? 'Won' : 'Lost'}</Text>
                </View>
              </View>
            </View>
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
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statBoxHighlight: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  championship: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  match: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  bet: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  odds: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  date: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    gap: 4,
  },
  statusWon: {
    backgroundColor: theme.colors.success,
  },
  statusLost: {
    backgroundColor: theme.colors.error,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
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
