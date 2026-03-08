// MODDESS TIPS - Enhanced Prediction Card
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { Prediction } from '@/services/predictions';

interface PredictionCardProps {
  prediction: Prediction;
  isVip?: boolean;
  onPress?: () => void;
}

export default function PredictionCard({ prediction, isVip = false, onPress }: PredictionCardProps) {
  const statusColors = {
    pending: theme.colors.info,
    won: theme.colors.success,
    lost: theme.colors.error,
  };

  const statusIcons = {
    pending: 'schedule',
    won: 'check-circle',
    lost: 'cancel',
  };

  const statusLabels = {
    pending: 'Pending',
    won: 'Won',
    lost: 'Lost',
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        isVip && styles.containerVip,
      ]}
      onPress={onPress}
    >
      {isVip && (
        <LinearGradient
          colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.vipBorder}
        />
      )}

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {prediction.championship && (
              <View style={styles.championshipBadge}>
                <MaterialIcons name="emoji-events" size={12} color={theme.colors.primary} />
                <Text style={styles.championshipText}>{prediction.championship}</Text>
              </View>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[prediction.status] }]}>
            <MaterialIcons name={statusIcons[prediction.status] as any} size={14} color="#FFF" />
            <Text style={styles.statusText}>{statusLabels[prediction.status]}</Text>
          </View>
        </View>

        {/* Match */}
        <Text style={styles.match}>{prediction.match}</Text>

        {/* Prediction Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MaterialIcons name="sports-soccer" size={16} color={theme.colors.primary} />
            <Text style={styles.detailLabel}>Bet:</Text>
            <Text style={styles.detailValue}>{prediction.bet}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="trending-up" size={16} color={theme.colors.success} />
            <Text style={styles.detailLabel}>Odds:</Text>
            <Text style={[styles.detailValue, styles.odds]}>{prediction.odds}</Text>
          </View>
        </View>

        {/* Success Rate */}
        {prediction.success_rate && (
          <View style={styles.successRate}>
            <View style={styles.successRateBar}>
              <View
                style={[
                  styles.successRateFill,
                  { width: `${prediction.success_rate}%`, backgroundColor: theme.colors.success },
                ]}
              />
            </View>
            <Text style={styles.successRateText}>{prediction.success_rate}% Success Rate</Text>
          </View>
        )}

        {/* Date */}
        {prediction.match_date && (
          <View style={styles.footer}>
            <MaterialIcons name="access-time" size={14} color={theme.colors.textMuted} />
            <Text style={styles.date}>
              {new Date(prediction.match_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}

        {/* Advice */}
        {prediction.advice && (
          <View style={styles.adviceContainer}>
            <MaterialIcons name="lightbulb" size={14} color={theme.colors.warning} />
            <Text style={styles.advice} numberOfLines={2}>{prediction.advice}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  containerVip: {
    borderWidth: 0,
    ...theme.shadows.blue,
  },
  vipBorder: {
    height: 4,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  championshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    gap: 4,
  },
  championshipText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    gap: 4,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  match: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  details: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  detailValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.fontWeight.semibold,
  },
  odds: {
    color: theme.colors.success,
    fontSize: theme.fontSize.md,
  },
  successRate: {
    marginBottom: theme.spacing.sm,
  },
  successRateBar: {
    height: 6,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: 4,
  },
  successRateFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  successRateText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: 6,
    marginTop: theme.spacing.xs,
  },
  advice: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});
