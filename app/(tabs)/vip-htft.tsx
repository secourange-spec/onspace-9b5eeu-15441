// MODDESS TIPS - VIP HT/FT Category
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { PredictionCard } from '@/components';
import { predictionsService, Prediction } from '@/services/predictions';
import { useAlert } from '@/template';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function VipHtFtScreen() {
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPredictions = async () => {
    const { data, error } = await predictionsService.getPredictionsBySection('ht_ft_vip');
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPredictions();
    setRefreshing(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'HT/FT - VIP',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#000',
          headerShadowVisible: true,
        }}
      />
      <View style={[styles.container, { paddingTop: 0 }]}>
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
              <PredictionCard key={prediction.id} prediction={prediction} />
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
