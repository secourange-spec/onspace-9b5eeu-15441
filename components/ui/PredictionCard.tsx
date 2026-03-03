// MODDESS TIPS - Prediction Card Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { Prediction } from '@/services/predictions';
import { LinearGradient } from 'expo-linear-gradient';

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const statusConfig = APP_CONFIG.status[prediction.status];
  const isVip = prediction.category === 'vip';

  const matchDate = prediction.match_date 
    ? new Date(prediction.match_date)
    : null;

  const formattedDate = matchDate
    ? matchDate.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      })
    : null;

  const formattedTime = matchDate
    ? matchDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <View style={styles.card}>
      {isVip && (
        <LinearGradient
          colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.vipBanner}
        >
          <MaterialIcons name="workspace-premium" size={14} color="#000" />
          <Text style={styles.vipBannerText}>VIP EXCLUSIF</Text>
        </LinearGradient>
      )}

      {/* Championship */}
      {prediction.championship && (
        <View style={styles.championshipRow}>
          <MaterialIcons name="sports-soccer" size={16} color={theme.colors.primary} />
          <Text style={styles.championshipText}>{prediction.championship}</Text>
        </View>
      )}

      {/* Match */}
      <Text style={styles.matchText}>{prediction.match}</Text>

      {/* Date & Time */}
      {matchDate && (
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeItem}>
            <MaterialIcons name="calendar-today" size={14} color={theme.colors.textMuted} />
            <Text style={styles.dateTimeText}>{formattedDate}</Text>
          </View>
          <View style={styles.dateTimeItem}>
            <MaterialIcons name="schedule" size={14} color={theme.colors.textMuted} />
            <Text style={styles.dateTimeText}>{formattedTime}</Text>
          </View>
        </View>
      )}

      {/* Bet & Odds */}
      <View style={styles.betOddsRow}>
        <View style={styles.betContainer}>
          <Text style={styles.label}>Pronostic</Text>
          <Text style={styles.betValue}>{prediction.bet}</Text>
        </View>
        <View style={styles.oddsContainer}>
          <Text style={styles.label}>Côte</Text>
          <Text style={styles.oddsValue}>{prediction.odds}</Text>
        </View>
      </View>

      {/* Success Rate */}
      {prediction.success_rate && (
        <View style={styles.successRateRow}>
          <MaterialIcons name="trending-up" size={16} color={theme.colors.success} />
          <Text style={styles.successRateText}>Taux de réussite: {prediction.success_rate}%</Text>
        </View>
      )}

      {/* Advice */}
      {prediction.advice && (
        <View style={styles.adviceContainer}>
          <MaterialIcons name="lightbulb" size={16} color={theme.colors.warning} />
          <Text style={styles.adviceText}>{prediction.advice}</Text>
        </View>
      )}

      {/* Status */}
      <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
        <Text style={styles.statusText}>{statusConfig.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  vipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginHorizontal: -theme.spacing.md,
    marginTop: -theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: 4,
  },
  vipBannerText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  championshipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.xs,
  },
  championshipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  matchText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTimeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  betOddsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  betContainer: {
    flex: 2,
  },
  oddsContainer: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
    paddingLeft: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: theme.fontWeight.semibold,
  },
  betValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  oddsValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  successRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  successRateText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.success,
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.warning,
  },
  adviceText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
});
