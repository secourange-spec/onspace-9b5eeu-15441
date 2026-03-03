// MODDESS TIPS - VIP Badge Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface VipBadgeProps {
  isVip: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function VipBadge({ isVip, size = 'medium' }: VipBadgeProps) {
  const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;
  const fontSize = size === 'small' ? theme.fontSize.xs : size === 'large' ? theme.fontSize.md : theme.fontSize.sm;

  if (isVip) {
    return (
      <LinearGradient
        colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.badge, size === 'small' && styles.badgeSmall, size === 'large' && styles.badgeLarge]}
      >
        <MaterialIcons name="workspace-premium" size={iconSize} color="#000" />
        <Text style={[styles.badgeText, { fontSize }]}>VIP</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.badge, styles.freeBadge, size === 'small' && styles.badgeSmall, size === 'large' && styles.badgeLarge]}>
      <MaterialIcons name="person" size={iconSize} color={theme.colors.freeGray} />
      <Text style={[styles.badgeText, styles.freeText, { fontSize }]}>FREE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  badgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  freeBadge: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeText: {
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  freeText: {
    color: theme.colors.freeGray,
  },
});
