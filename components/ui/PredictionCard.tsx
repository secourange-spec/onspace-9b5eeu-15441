// MODDESS TIPS - Enhanced Professional Prediction Card (VIP Badge + Blue Theme)
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

  // Auto-detect VIP from category
  const isVipPrediction = prediction.category === 'vip' || isVip;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        isVipPrediction && styles.containerVip,
      ]}
      onPress={onPress}
    >
      {/* VIP Top Border */}
      {isVipPrediction && (
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
          
          {/* VIP Badge + Status */}
          <View style={styles.headerRight}>
            {isVipPrediction && (
              <View style={styles.vipBadge}>
                <MaterialIcons name="workspace-premium" size={12} color="#FFF" />
                <Text style={styles.vipBadgeText}>VIP</Text>
              </View>
            )}
            <View style={[styles.statusBadge, { backgroundColor: statusColors[prediction.status] }]}>
              <MaterialIcons name={statusIcons[prediction.status] as any} size={14} color="#FFF" />
              <Text style={styles.statusText}>{statusLabels[prediction.status]}</Text>
            </View>
          </View>
        </View>

        {/* Match */}
        <Text style={styles.match}>{prediction.match}</Text>

        {/* Prediction Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <MaterialIcons name="sports-soccer" size={20} color={theme.colors.primary} />
            <View style={styles.detailCardContent}>
              <Text style={styles.detailCardLabel}>BET</Text>
              <Text style={styles.detailCardValue} numberOfLines={2}>{prediction.bet}</Text>
            </View>
          </View>

          <View style={styles.detailCard}>
            <MaterialIcons name="trending-up" size={20} color={theme.colors.success} />
            <View style={styles.detailCardContent}>
              <Text style={styles.detailCardLabel}>ODDS</Text>
              <Text style={[styles.detailCardValue, styles.oddsValue]}>{prediction.odds}</Text>
            </View>
          </View>
        </View>

        {/* Success Rate Bar */}
        {prediction.success_rate && (
          <View style={styles.successRateContainer}>
            <View style={styles.successRateHeader}>
              <Text style={styles.successRateLabel}>Success Rate</Text>
              <Text style={styles.successRatePercent}>{prediction.success_rate}%</Text>
            </View>
            <View style={styles.successRateBar}>
              <LinearGradient
                colors={[theme.colors.success, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.successRateFill, { width: `${prediction.success_rate}%` }]}
              />
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {prediction.match_date && (
            <View style={styles.footerItem}>
              <MaterialIcons name="access-time" size={14} color={theme.colors.textMuted} />
              <Text style={styles.footerText}>
                {new Date(prediction.match_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          )}
          
          {prediction.confidence && (
            <View style={styles.footerItem}>
              <MaterialIcons name="star" size={14} color={theme.colors.adviceBlue} />
              <Text style={styles.footerText}>{prediction.confidence}</Text>
            </View>
          )}
        </View>

        {/* Advice - BLUE color (NO ORANGE) */}
        {prediction.advice && (
          <View style={styles.adviceContainer}>
            <MaterialIcons name="lightbulb-outline" size={16} color={theme.colors.adviceBlue} />
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
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 6,
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
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
    gap: 3,
  },
  vipBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
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
    marginBottom: theme.spacing.md,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  detailCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  detailCardContent: {
    flex: 1,
  },
  detailCardLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 2,
  },
  detailCardValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.fontWeight.bold,
  },
  oddsValue: {
    color: theme.colors.success,
    fontSize: theme.fontSize.md,
  },
  successRateContainer: {
    marginBottom: theme.spacing.sm,
  },
  successRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  successRateLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.semibold,
  },
  successRatePercent: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.success,
    fontWeight: theme.fontWeight.bold,
  },
  successRateBar: {
    height: 8,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  successRateFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 6,
    marginTop: theme.spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.adviceBlue,
  },
  advice: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.adviceBlue,
    fontStyle: 'italic',
    lineHeight: 18,
    fontWeight: theme.fontWeight.medium,
  },
});
