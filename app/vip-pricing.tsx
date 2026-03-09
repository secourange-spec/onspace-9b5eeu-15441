// MODDESS TIPS - VIP Pricing Screen
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VipPricingScreen() {
  const insets = useSafeAreaInsets();

  const handlePricingPress = (planId: string, duration: string, price: number) => {
    const message = encodeURIComponent(
      `Hello admin, I would like to subscribe to the VIP offer for ${duration} ($${price})`
    );
    Linking.openURL(`${APP_CONFIG.telegram.admin}?text=${message}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <MaterialIcons name="workspace-premium" size={48} color="#000" />
        </LinearGradient>
        <Text style={styles.title}>Become VIP</Text>
        <Text style={styles.subtitle}>Access premium predictions and maximize your earnings</Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>VIP Benefits</Text>
        {[
          { icon: 'stars', text: 'Odds 2 VIP - Safe predictions' },
          { icon: 'workspace-premium', text: 'Odds 5 VIP - High returns' },
          { icon: 'bullseye', text: 'Correct Score - Maximum precision' },
          { icon: 'schedule', text: 'HT/FT - Double opportunity' },
          { icon: 'trending-up', text: 'Daily expert advice' },
          { icon: 'support-agent', text: 'Priority support' },
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <MaterialIcons name={feature.icon as any} size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>

      {/* Pricing Plans */}
      <View style={styles.pricingContainer}>
        {APP_CONFIG.vipPricing.map((plan) => (
          <Pressable
            key={plan.id}
            style={({ pressed }) => [
              styles.pricingCard,
              plan.popular && styles.pricingCardPopular,
              pressed && styles.pricingCardPressed,
            ]}
            onPress={() => handlePricingPress(plan.id, plan.duration, plan.price)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>POPULAR</Text>
              </View>
            )}
            <Text style={styles.pricingDuration}>{plan.duration}</Text>
            <View style={styles.pricingPriceContainer}>
              <Text style={styles.pricingPrice}>{plan.price}$</Text>
              <Text style={styles.pricingPerDay}>
                {(plan.price / plan.days).toFixed(2)}$/day
              </Text>
            </View>
            <View style={styles.pricingButton}>
              <Text style={styles.pricingButtonText}>Subscribe</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#000" />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <MaterialIcons name="info-outline" size={20} color={theme.colors.info} />
        <Text style={styles.infoText}>
          Click on a plan to contact the admin on Telegram and complete your subscription
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.gold,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  features: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featuresTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  pricingContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  pricingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  pricingCardPopular: {
    borderColor: theme.colors.primary,
    ...theme.shadows.gold,
  },
  pricingCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  popularText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  pricingDuration: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  pricingPriceContainer: {
    marginBottom: theme.spacing.md,
  },
  pricingPrice: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  pricingPerDay: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  pricingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  pricingButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.info + '40',
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
