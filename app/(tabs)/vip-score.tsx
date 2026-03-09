// MODDESS TIPS - VIP Score Exact Category (With Back Button and Auto-Refresh)
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { PredictionCard } from '@/components';
import { predictionsService, Prediction } from '@/services/predictions';
import { useAlert } from '@/template';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function VipScoreScreen() {
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPredictions = async () => {
    const { data, error } = await predictionsService.getPredictionsBySection('score_exact_vip');
    if (error) {
      showAlert('Error', error);
    } else if (data) {
      setPredictions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  // Auto-refresh when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadPredictions();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPredictions();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Correct Score - VIP</Text>
          <Text style={styles.subtitle}>Precise score predictions</Text>
        </View>
        <View style={styles.headerRight}>
          <MaterialIcons name="military-tech" size={24} color="#FFF" />
        </View>
      </View>

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
        ) : predictions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No predictions available</Text>
            <Text style={styles.emptySubtext}>Check back later for new VIP predictions</Text>
          </View>
        ) : (
          predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} isVip={true} />
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
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    color: '#FFF',
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerRight: {
    marginLeft: theme.spacing.sm,
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
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
