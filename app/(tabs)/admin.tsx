
// MODDESS TIPS - Professional Admin Dashboard (English, Fixed User Loading, Push Notifications)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Platform, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { useUser } from '@/hooks/useUser';
import { useAlert } from '@/template';
import { usersService, UserProfile } from '@/services/users';
import { predictionsService, Prediction, HistoryEntry } from '@/services/predictions';
import { notificationsService, Notification } from '@/services/notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NewPrediction {
  championship: string;
  match: string;
  category: 'free' | 'vip';
  section: string;
  bet: string;
  odds: string;
  success_rate: string;
  match_date?: string;
  advice: string;
}

export default function AdminScreen() {
  const { isAdmin } = useUser();
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'predictions' | 'users' | 'stats' | 'history' | 'notifications'>('stats');
  const [refreshing, setRefreshing] = useState(false);
  
  // Users state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'admin' | 'user' | 'vip'>('all');
  const [userPage, setUserPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const USERS_PER_PAGE = 50; // Increased from 20 to 50

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  const [manualDateTime, setManualDateTime] = useState('');

  // Push Notification form
  const [pushNotification, setPushNotification] = useState({
    title: '',
    message: '',
    type: 'info' as Notification['type'],
  });

  // Prediction form
  const [newPrediction, setNewPrediction] = useState<NewPrediction>({
    championship: '',
    match: '',
    category: 'free',
    section: 'cote_2_free',
    bet: '',
    odds: '',
    success_rate: '',
    match_date: new Date().toISOString(), // Fixed: 'toISO String()' to 'toISOString()'
    advice: '',
  });

  const freeSections = [
    { value: 'cote_2_free', label: 'Odds 2' },
    { value: 'accumulation_free', label: 'Accumulator' },
  ];

  const vipSections = [
    { value: 'cote_2_vip', label: 'Odds 2 VIP' },
    { value: 'cote_5_vip', label: 'Odds 5 VIP' },
    { value: 'score_exact_vip', label: 'Correct Score' },
    { value: 'ht_ft_vip', label: 'HT/FT' },
  ];

  const sections = newPrediction.category === 'free' ? freeSections : vipSections;

  // Load users with pagination - FIXED
  const loadUsers = useCallback(async (page: number = 0, append: boolean = false) => {
    if (loadingUsers) return; // Prevent duplicate calls
    
    setLoadingUsers(true);
    console.log(`[Admin] Loading users - Page: ${page}, Append: ${append}`);
    
    const { data, error, count } = await usersService.getAllUsers({
      limit: USERS_PER_PAGE,
      offset: page * USERS_PER_PAGE,
      search: userSearch || undefined,
      role: userFilter === 'vip' ? undefined : (userFilter as 'all' | 'admin' | 'user'),
      vipOnly: userFilter === 'vip',
    });
    
    setLoadingUsers(false);
    
    if (error) {
      console.error('[Admin] Error loading users:', error);
      showAlert('Error', error);
    } else if (data) {
      console.log(`[Admin] Loaded ${data.length} users (Total: ${count})`);
      
      if (append) {
        setUsers(prev => [...prev, ...data]);
      } else {
        setUsers(data);
      }
      setTotalUsers(count || 0);
      setHasMoreUsers(data.length === USERS_PER_PAGE);
    }
  }, [userSearch, userFilter, loadingUsers]);

  const loadMoreUsers = () => {
    if (hasMoreUsers && !loadingUsers) {
      const nextPage = userPage + 1;
      setUserPage(nextPage);
      loadUsers(nextPage, true);
    }
  };

  const refreshUsers = () => {
    setUserPage(0);
    setUsers([]); // Clear existing users
    loadUsers(0, false);
  };

  const loadPredictions = async () => {
    const { data, error } = await predictionsService.getActivePredictions(true);
    if (error) {
      showAlert('Error', error);
    } else if (data) {
      setPredictions(data);
    }
  };

  const loadHistory = async () => {
    const { data, error } = await predictionsService.getAllHistory();
    if (error) {
      showAlert('Error', error);
    } else if (data) {
      setHistory(data);
    }
  };

  const loadNotifications = async () => {
    const { data, error } = await notificationsService.getAllNotifications();
    if (error) {
      showAlert('Error', error);
    } else if (data) {
      setNotifications(data);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (activeTab === 'users') await refreshUsers();
    if (activeTab === 'predictions') await loadPredictions();
    if (activeTab === 'history') await loadHistory();
    if (activeTab === 'notifications') await loadNotifications();
    setRefreshing(false);
  }, [activeTab]);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'users') refreshUsers();
      if (activeTab === 'predictions') loadPredictions();
      if (activeTab === 'history') loadHistory();
      if (activeTab === 'notifications') loadNotifications();
    }
  }, [isAdmin, activeTab]);

  // Reload users when filters change
  useEffect(() => {
    if (isAdmin && activeTab === 'users') {
      setUserPage(0);
      setUsers([]);
      loadUsers(0, false);
    }
  }, [userSearch, userFilter]);

  // Create prediction (without auto-notification)
  const handleCreatePrediction = async () => {
    if (!newPrediction.championship || !newPrediction.match || !newPrediction.bet || !newPrediction.odds) {
      showAlert('Error', 'Please fill in all required fields (Championship, Match, Bet, Odds)');
      return;
    }

    const { data, error } = await predictionsService.createPrediction(newPrediction);
    if (error) {
      showAlert('Error', error);
    } else {
      showAlert('Success', 'Prediction created successfully! Send a push notification to notify users.');
      setShowCreateModal(false);
      setNewPrediction({
        championship: '',
        match: '',
        category: 'free',
        section: 'cote_2_free',
        bet: '',
        odds: '',
        success_rate: '',
        match_date: new Date().toISOString(),
        advice: '',
      });
      loadPredictions();
    }
  };

  // Send push notification to all users
  const handleSendPushNotification = async () => {
    if (!pushNotification.title || !pushNotification.message) {
      showAlert('Error', 'Please fill in title and message');
      return;
    }

    const { error } = await notificationsService.notifyAllUsers(
      pushNotification.title,
      pushNotification.message,
      pushNotification.type
    );

    if (error) {
      showAlert('Error', error);
    } else {
      showAlert('Success', 'Push notification sent to all users!');
      setShowNotificationModal(false);
      setPushNotification({ title: '', message: '', type: 'info' });
    }
  };

  // Update prediction status
  const handleUpdateStatus = async (predictionId: string, status: 'won' | 'lost') => {
    const { error } = await predictionsService.updatePredictionStatus(predictionId, status);
    if (error) {
      showAlert('Error', error);
    } else {
      showAlert('Success', `Prediction marked as ${status}`);
      loadPredictions();
    }
  };

  // Move to history
  const handleMoveToHistory = async (predictionId: string) => {
    const { error } = await predictionsService.moveToHistory(predictionId);
    if (error) {
      showAlert('Error', error);
    } else {
      showAlert('Success', 'Prediction moved to history');
      loadPredictions();
    }
  };

  // Delete prediction
  const handleDeletePrediction = async (predictionId: string) => {
    const { error } = await predictionsService.deletePrediction(predictionId);
    if (error) {
      showAlert('Error', error);
    } else {
      showAlert('Success', 'Prediction deleted');
      loadPredictions();
    }
  };

  // Delete history
  const handleDeleteHistory = async (historyId: string) => {
    const { error } = await predictionsService.deleteHistory(historyId);
    if (error) {
      showAlert('Error', error);
    } else {
      setHistory(prev => prev.filter(h => h.id !== historyId));
      showAlert('Success', 'History deleted');
    }
  };

  // Delete notification
  const handleDeleteNotification = async (notificationId: string) => {
    const { error } = await notificationsService.deleteNotification(notificationId);
    if (error) {
      showAlert('Error', error);
    } else {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      showAlert('Success', 'Notification deleted');
    }
  };

  // Update VIP status - UPDATED PRICES
  const handleUpdateVip = async (userId: string, isVip: boolean, days?: number) => {
    const expireDate = days
      ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const { error } = await usersService.updateVipStatus(userId, isVip, expireDate);
    if (error) {
      showAlert('Error', error);
    } else {
      showAlert('Success', isVip ? 'User upgraded to VIP' : 'VIP access revoked');
      refreshUsers();
      setShowUserModal(false);
    }
  };

  // Ban user
  const handleBanUser = async (userId: string, ban: boolean) => {
    const { error } = await usersService.updateBanStatus(userId, ban);
    if (error) {
      showAlert('Error', error);
    } else {
      showAlert('Success', ban ? 'User banned' : 'User unbanned');
      refreshUsers();
      setShowUserModal(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    const { error } = await usersService.deleteUser(userId);
    if (error) {
      showAlert('Error', error);
    } else {
      showAlert('Success', 'User deleted');
      refreshUsers();
      setShowUserModal(false);
    }
  };

  // Format date from manual input
  const formatManualDate = (input: string): string | undefined => {
    try {
      if (!input.trim()) return new Date().toISOString();
      
      const parts = input.trim().split(' ');
      if (parts.length !== 2) return undefined;
      
      const datePart = parts[0];
      const timePart = parts[1];
      
      let year: number, month: number, day: number;
      
      if (datePart.includes('/')) {
        const dateComponents = datePart.split('/');
        if (dateComponents.length !== 3) return undefined;
        day = parseInt(dateComponents[0]);
        month = parseInt(dateComponents[1]) - 1;
        year = parseInt(dateComponents[2]);
      } else if (datePart.includes('-')) {
        const dateComponents = datePart.split('-');
        if (dateComponents.length !== 3) return undefined;
        year = parseInt(dateComponents[0]);
        month = parseInt(dateComponents[1]) - 1;
        day = parseInt(dateComponents[2]);
      } else {
        return undefined;
      }
      
      const timeComponents = timePart.split(':');
      if (timeComponents.length !== 2) return undefined;
      
      const hours = parseInt(timeComponents[0]);
      const minutes = parseInt(timeComponents[1]);
      
      const date = new Date(year, month, day, hours, minutes);
      return date.toISOString();
    } catch {
      return undefined;
    }
  };

  const stats = {
    totalUsers,
    vipUsers: users.filter(u => usersService.isVipActive(u)).length,
    freeUsers: users.filter(u => !usersService.isVipActive(u)).length,
    activePredictions: predictions.length,
    wonRate: (predictions.filter(p => p.status === 'won').length / Math.max(predictions.length, 1) * 100).toFixed(1),
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Complete Management</Text>
        </View>
        <MaterialIcons name="admin-panel-settings" size={28} color="#FFF" />
      </LinearGradient>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabs}
      >
        <Pressable
          style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
          onPress={() => setActiveTab('stats')}
        >
          <MaterialIcons name="bar-chart" size={18} color={activeTab === 'stats' ? theme.colors.primary : theme.colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>Stats</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'predictions' && styles.tabActive]}
          onPress={() => setActiveTab('predictions')}
        >
          <MaterialIcons name="sports-soccer" size={18} color={activeTab === 'predictions' ? theme.colors.primary : theme.colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'predictions' && styles.tabTextActive]}>Predictions</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <MaterialIcons name="people" size={18} color={activeTab === 'users' ? theme.colors.primary : theme.colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>Users ({totalUsers})</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <MaterialIcons name="history" size={18} color={activeTab === 'history' ? theme.colors.primary : theme.colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'notifications' && styles.tabActive]}
          onPress={() => setActiveTab('notifications')}
        >
          <MaterialIcons name="send" size={18} color={activeTab === 'notifications' ? theme.colors.primary : theme.colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.tabTextActive]}>Push</Text>
        </Pressable>
      </ScrollView>

      {/* Content with Pull-to-Refresh */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardPrimary]}>
              <MaterialIcons name="people" size={36} color="#FFF" />
              <Text style={styles.statValueWhite}>{stats.totalUsers}</Text>
              <Text style={styles.statLabelWhite}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="workspace-premium" size={32} color={theme.colors.primary} />
              <Text style={styles.statValue}>{stats.vipUsers}</Text>
              <Text style={styles.statLabel}>VIP Active</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="person" size={32} color={theme.colors.textMuted} />
              <Text style={styles.statValue}>{stats.freeUsers}</Text>
              <Text style={styles.statLabel}>FREE Users</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="sports-soccer" size={32} color={theme.colors.success} />
              <Text style={styles.statValue}>{stats.activePredictions}</Text>
              <Text style={styles.statLabel}>Active Predictions</Text>
            </View>
            <View style={styles.statCardLarge}>
              <MaterialIcons name="trending-up" size={44} color={theme.colors.success} />
              <Text style={styles.statValueLarge}>{stats.wonRate}%</Text>
              <Text style={styles.statLabelLarge}>Overall Success Rate</Text>
            </View>
          </View>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <View>
            <Pressable style={styles.createButton} onPress={() => setShowCreateModal(true)}>
              <MaterialIcons name="add-circle" size={24} color="#FFF" />
              <Text style={styles.createButtonText}>Create Prediction</Text>
            </Pressable>

            {predictions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="sports-soccer" size={48} color={theme.colors.textMuted} />
                <Text style={styles.emptyText}>No active predictions</Text>
              </View>
            ) : (
              predictions.map((prediction) => (
                <View key={prediction.id} style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <Text style={styles.predictionChampionship}>{prediction.championship || 'Not specified'}</Text>
                    <View style={[styles.categoryBadge, prediction.category === 'vip' && styles.categoryBadgeVip]}>
                      <Text style={styles.categoryText}>{prediction.category.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.predictionMatch}>{prediction.match}</Text>
                  <Text style={styles.predictionBet}>Bet: {prediction.bet}</Text>
                  <Text style={styles.predictionOdds}>Odds: {prediction.odds}</Text>
                  
                  <View style={styles.predictionActions}>
                    {prediction.status === 'pending' && (
                      <>
                        <Pressable
                          style={[styles.actionButton, styles.actionButtonSuccess]}
                          onPress={() => handleUpdateStatus(prediction.id, 'won')}
                        >
                          <MaterialIcons name="check" size={16} color="#fff" />
                          <Text style={styles.actionButtonText}>Won</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.actionButton, styles.actionButtonError]}
                          onPress={() => handleUpdateStatus(prediction.id, 'lost')}
                        >
                          <MaterialIcons name="close" size={16} color="#fff" />
                          <Text style={styles.actionButtonText}>Lost</Text>
                        </Pressable>
                      </>
                    )}
                    {prediction.status !== 'pending' && (
                      <Pressable
                        style={[styles.actionButton, styles.actionButtonInfo]}
                        onPress={() => handleMoveToHistory(prediction.id)}
                      >
                        <MaterialIcons name="archive" size={16} color="#fff" />
                        <Text style={styles.actionButtonText}>Archive</Text>
                      </Pressable>
                    )}
                    <Pressable
                      style={[styles.actionButton, styles.actionButtonWarning]}
                      onPress={() => handleDeletePrediction(prediction.id)}
                    >
                      <MaterialIcons name="delete" size={16} color="#fff" />
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Users Tab - FIXED */}
        {activeTab === 'users' && (
          <View>
            {/* Search */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by email..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={userSearch}
                  onChangeText={setUserSearch}
                />
                {userSearch ? (
                  <Pressable onPress={() => setUserSearch('')}>
                    <MaterialIcons name="close" size={20} color={theme.colors.textMuted} />
                  </Pressable>
                ) : null}
              </View>
            </View>

            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
              contentContainerStyle={styles.filterContent}
            >
              <Pressable
                style={[styles.filterChip, userFilter === 'all' && styles.filterChipActive]}
                onPress={() => setUserFilter('all')}
              >
                <Text style={[styles.filterChipText, userFilter === 'all' && styles.filterChipTextActive]}>All</Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, userFilter === 'vip' && styles.filterChipActive]}
                onPress={() => setUserFilter('vip')}
              >
                <Text style={[styles.filterChipText, userFilter === 'vip' && styles.filterChipTextActive]}>VIP</Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, userFilter === 'admin' && styles.filterChipActive]}
                onPress={() => setUserFilter('admin')}
              >
                <Text style={[styles.filterChipText, userFilter === 'admin' && styles.filterChipTextActive]}>Admins</Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, userFilter === 'user' && styles.filterChipActive]}
                onPress={() => setUserFilter('user')}
              >
                <Text style={[styles.filterChipText, userFilter === 'user' && styles.filterChipTextActive]}>Users</Text>
              </Pressable>
            </ScrollView>

            {/* Count */}
            <Text style={styles.userCount}>
              {totalUsers} user{totalUsers > 1 ? 's' : ''} total · Showing {users.length} · Page {userPage + 1}
            </Text>

            {/* User List */}
            {users.map((user) => (
              <Pressable
                key={user.id}
                style={styles.userCard}
                onPress={() => {
                  setSelectedUser(user);
                  setShowUserModal(true);
                }}
              >
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.username || user.email.split('@')[0]}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <View style={styles.userBadges}>
                  {usersService.isVipActive(user) && (
                    <View style={styles.vipBadgeSmall}>
                      <Text style={styles.vipBadgeText}>VIP</Text>
                    </View>
                  )}
                  {user.role === 'admin' && (
                    <View style={styles.adminBadgeSmall}>
                      <Text style={styles.adminBadgeText}>ADMIN</Text>
                    </View>
                  )}
                  {user.banned && (
                    <View style={styles.bannedBadgeSmall}>
                      <Text style={styles.bannedBadgeText}>BANNED</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}

            {/* Load More */}
            {hasMoreUsers && !loadingUsers && (
              <Pressable style={styles.loadMoreButton} onPress={loadMoreUsers}>
                <MaterialIcons name="expand-more" size={20} color={theme.colors.primary} />
                <Text style={styles.loadMoreText}>Load More Users</Text>
              </Pressable>
            )}

            {/* Loading */}
            {loadingUsers && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}

            {/* End */}
            {!hasMoreUsers && users.length > 0 && (
              <Text style={styles.endOfListText}>All users loaded</Text>
            )}

            {/* Empty */}
            {users.length === 0 && !loadingUsers && (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="person-off" size={48} color={theme.colors.textMuted} />
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            )}
          </View>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <View>
            {history.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="history" size={48} color={theme.colors.textMuted} />
                <Text style={styles.emptyText}>No history</Text>
              </View>
            ) : (
              history.map((entry) => (
                <View key={entry.id} style={styles.historyCard}>
                  <Text style={styles.historyChampionship}>{entry.championship}</Text>
                  <Text style={styles.historyMatch}>{entry.match}</Text>
                  <Text style={styles.historyBet}>Bet: {entry.bet}</Text>
                  <View style={styles.historyFooter}>
                    <View style={[styles.statusBadge, entry.status === 'won' ? styles.statusWon : styles.statusLost]}>
                      <Text style={styles.statusText}>{entry.status === 'won' ? 'Won' : 'Lost'}</Text>
                    </View>
                    <Pressable
                      style={styles.deleteHistoryButton}
                      onPress={() => handleDeleteHistory(entry.id)}
                    >
                      <MaterialIcons name="delete" size={18} color={theme.colors.error} />
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Push Notifications Tab */}
        {activeTab === 'notifications' && (
          <View>
            <Pressable style={styles.createButton} onPress={() => setShowNotificationModal(true)}>
              <MaterialIcons name="send" size={24} color="#FFF" />
              <Text style={styles.createButtonText}>Send Push Notification</Text>
            </Pressable>

            <View style={styles.infoCard}>
              <MaterialIcons name="info" size={24} color={theme.colors.info} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Push Notifications Enabled</Text>
                <Text style={styles.infoText}>
                  Send instant push notifications to all users. They will receive alerts even when the app is closed.
                </Text>
              </View>
            </View>

            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="notifications-none" size={48} color={theme.colors.textMuted} />
                <Text style={styles.emptyText}>No notifications sent yet</Text>
              </View>
            ) : (
              notifications.map((notif) => (
                <View key={notif.id} style={styles.notifCard}>
                  <View style={styles.notifHeader}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Pressable onPress={() => handleDeleteNotification(notif.id)}>
                      <MaterialIcons name="delete" size={20} color={theme.colors.error} />
                    </Pressable>
                  </View>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                  <Text style={styles.notifDate}>
                    {new Date(notif.created_at).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Create Prediction Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Prediction</Text>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Championship *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Premier League, La Liga"
                placeholderTextColor={theme.colors.textMuted}
                value={newPrediction.championship}
                onChangeText={(text) => setNewPrediction({ ...newPrediction, championship: text })}
              />

              <Text style={styles.inputLabel}>Match (Team vs Team) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Manchester United vs Liverpool"
                placeholderTextColor={theme.colors.textMuted}
                value={newPrediction.match}
                onChangeText={(text) => setNewPrediction({ ...newPrediction, match: text })}
              />

              <Text style={styles.inputLabel}>Match Date & Time</Text>
              <View style={styles.dateInputContainer}>
                <MaterialIcons name="calendar-today" size={20} color={theme.colors.textSecondary} style={styles.dateIcon} />
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD/MM/YYYY HH:MM (ex: 25/03/2026 20:30)"
                  placeholderTextColor={theme.colors.textMuted}
                  value={manualDateTime}
                  onChangeText={(text) => {
                    setManualDateTime(text);
                    const formatted = formatManualDate(text);
                    if (formatted) {
                      setNewPrediction({ ...newPrediction, match_date: formatted });
                    }
                  }}
                  onBlur={() => {
                    if (manualDateTime.trim()) {
                      const formatted = formatManualDate(manualDateTime);
                      if (formatted) {
                        setNewPrediction({ ...newPrediction, match_date: formatted });
                      } else {
                        showAlert('Invalid Format', 'Use format: DD/MM/YYYY HH:MM');
                        setManualDateTime('');
                      }
                    }
                  }}
                />
              </View>

              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categorySelector}>
                <Pressable
                  style={[styles.categoryOption, newPrediction.category === 'free' && styles.categoryOptionActive]}
                  onPress={() => setNewPrediction({ ...newPrediction, category: 'free', section: 'cote_2_free' })}
                >
                  <Text style={[styles.categoryOptionText, newPrediction.category === 'free' && styles.categoryOptionTextActive]}>FREE</Text>
                </Pressable>
                <Pressable
                  style={[styles.categoryOption, newPrediction.category === 'vip' && styles.categoryOptionActive]}
                  onPress={() => setNewPrediction({ ...newPrediction, category: 'vip', section: 'cote_2_vip' })}
                >
                  <Text style={[styles.categoryOptionText, newPrediction.category === 'vip' && styles.categoryOptionTextActive]}>VIP</Text>
                </Pressable>
              </View>

              <Text style={styles.inputLabel}>Section *</Text>
              <View style={styles.sectionSelector}>
                {sections.map((section) => (
                  <Pressable
                    key={section.value}
                    style={[
                      styles.sectionOption,
                      newPrediction.section === section.value && styles.sectionOptionActive,
                    ]}
                    onPress={() => setNewPrediction({ ...newPrediction, section: section.value })}
                  >
                    <Text
                      style={[
                        styles.sectionOptionText,
                        newPrediction.section === section.value && styles.sectionOptionTextActive,
                      ]}
                    >
                      {section.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Bet *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Over 2.5 Goals, Home Win"
                placeholderTextColor={theme.colors.textMuted}
                value={newPrediction.bet}
                onChangeText={(text) => setNewPrediction({ ...newPrediction, bet: text })}
              />

              <Text style={styles.inputLabel}>Odds *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1.85"
                placeholderTextColor={theme.colors.textMuted}
                value={newPrediction.odds}
                onChangeText={(text) => setNewPrediction({ ...newPrediction, odds: text })}
                keyboardType="decimal-pad"
              />

              <Text style={styles.inputLabel}>Success Rate (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 85"
                placeholderTextColor={theme.colors.textMuted}
                value={newPrediction.success_rate}
                onChangeText={(text) => setNewPrediction({ ...newPrediction, success_rate: text })}
                keyboardType="number-pad"
              />

              <Text style={styles.inputLabel}>Advice (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add analysis or advice"
                placeholderTextColor={theme.colors.textMuted}
                value={newPrediction.advice}
                onChangeText={(text) => setNewPrediction({ ...newPrediction, advice: text })}
                multiline
                numberOfLines={3}
              />

              <Pressable style={styles.submitButton} onPress={handleCreatePrediction}>
                <MaterialIcons name="check-circle" size={20} color="#FFF" />
                <Text style={styles.submitButtonText}>Create Prediction</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Push Notification Modal */}
      <Modal visible={showNotificationModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Push Notification</Text>
              <Pressable onPress={() => setShowNotificationModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Notification Type</Text>
              <View style={styles.notifTypeSelector}>
                {(['info', 'success', 'warning', 'prediction'] as const).map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.notifTypeOption,
                      pushNotification.type === type && styles.notifTypeOptionActive,
                    ]}
                    onPress={() => setPushNotification({ ...pushNotification, type })}
                  >
                    <Text
                      style={[
                        styles.notifTypeText,
                        pushNotification.type === type && styles.notifTypeTextActive,
                      ]}
                    >
                      {type.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: New Prediction Available"
                placeholderTextColor={theme.colors.textMuted}
                value={pushNotification.title}
                onChangeText={(text) => setPushNotification({ ...pushNotification, title: text })}
              />

              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Your custom message..."
                placeholderTextColor={theme.colors.textMuted}
                value={pushNotification.message}
                onChangeText={(text) => setPushNotification({ ...pushNotification, message: text })}
                multiline
                numberOfLines={4}
              />

              <Pressable style={styles.submitButton} onPress={handleSendPushNotification}>
                <MaterialIcons name="send" size={20} color="#FFF" />
                <Text style={styles.submitButtonText}>Send to All Users</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* User Management Modal */}
      <Modal visible={showUserModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage User</Text>
              <Pressable onPress={() => setShowUserModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.userModalName}>{selectedUser?.email}</Text>

              <Text style={styles.sectionLabel}>VIP Status - UPDATED PRICES</Text>
              <View style={styles.vipActions}>
                <Pressable
                  style={styles.vipActionButton}
                  onPress={() => selectedUser && handleUpdateVip(selectedUser.id, true, 7)}
                >
                  <MaterialIcons name="workspace-premium" size={18} color="#FFF" />
                  <Text style={styles.vipActionText}>VIP 1 Week - $25</Text>
                </Pressable>
                <Pressable
                  style={styles.vipActionButton}
                  onPress={() => selectedUser && handleUpdateVip(selectedUser.id, true, 30)}
                >
                  <MaterialIcons name="workspace-premium" size={18} color="#FFF" />
                  <Text style={styles.vipActionText}>VIP 1 Month - $45</Text>
                </Pressable>
                <Pressable
                  style={styles.vipActionButton}
                  onPress={() => selectedUser && handleUpdateVip(selectedUser.id, true, 365)}
                >
                  <MaterialIcons name="workspace-premium" size={18} color="#FFF" />
                  <Text style={styles.vipActionText}>VIP 1 Year - $80</Text>
                </Pressable>
                <Pressable
                  style={[styles.vipActionButton, styles.vipActionButtonDanger]}
                  onPress={() => selectedUser && handleUpdateVip(selectedUser.id, false)}
                >
                  <MaterialIcons name="block" size={18} color="#FFF" />
                  <Text style={styles.vipActionText}>Revoke VIP</Text>
                </Pressable>
              </View>

              <Text style={styles.sectionLabel}>Actions</Text>
              <Pressable
                style={styles.dangerButton}
                onPress={() => selectedUser && handleBanUser(selectedUser.id, !selectedUser.banned)}
              >
                <MaterialIcons name={selectedUser?.banned ? 'check-circle' : 'block'} size={20} color="#fff" />
                <Text style={styles.dangerButtonText}>
                  {selectedUser?.banned ? 'Unban User' : 'Ban User'}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.dangerButton, { marginTop: theme.spacing.sm }]}
                onPress={() => selectedUser && handleDeleteUser(selectedUser.id)}
              >
                <MaterialIcons name="delete-forever" size={20} color="#fff" />
                <Text style={styles.dangerButtonText}>Delete User</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tabsContainer: {
    maxHeight: 56,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabs: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 6,
    backgroundColor: theme.colors.surfaceLight,
  },
  tabActive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  statCardPrimary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  statCardLarge: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statValueWhite: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  statValueLarge: {
    fontSize: 40,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  statLabelWhite: {
    fontSize: theme.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statLabelLarge: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontWeight: theme.fontWeight.medium,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.blue,
  },
  createButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  predictionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  predictionChampionship: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.success,
  },
  categoryBadgeVip: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  predictionMatch: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  predictionBet: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  predictionOdds: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  predictionActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: 4,
  },
  actionButtonSuccess: {
    backgroundColor: theme.colors.success,
  },
  actionButtonError: {
    backgroundColor: theme.colors.error,
  },
  actionButtonInfo: {
    backgroundColor: theme.colors.info,
  },
  actionButtonWarning: {
    backgroundColor: theme.colors.error,
  },
  actionButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    includeFontPadding: false,
  },
  filterContainer: {
    maxHeight: 48,
    marginBottom: theme.spacing.sm,
  },
  filterContent: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  userCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.fontWeight.medium,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  userEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  userBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  vipBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
  },
  vipBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  adminBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.info,
  },
  adminBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  bannedBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.error,
  },
  bannedBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  loadMoreText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  loadingContainer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  endOfListText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
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
  historyChampionship: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  historyMatch: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  historyBet: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
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
    color: '#fff',
  },
  deleteHistoryButton: {
    padding: theme.spacing.xs,
  },
  notifCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  notifMessage: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  notifDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  modalBody: {
    padding: theme.spacing.md,
    maxHeight: 500,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  dateIcon: {
    marginRight: theme.spacing.sm,
  },
  dateInput: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  categoryOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  categoryOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryOptionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  categoryOptionTextActive: {
    color: '#FFF',
  },
  sectionSelector: {
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  sectionOption: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  sectionOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sectionOptionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
  },
  sectionOptionTextActive: {
    color: '#FFF',
  },
  notifTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  notifTypeOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  notifTypeOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  notifTypeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  notifTypeTextActive: {
    color: '#FFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.blue,
  },
  submitButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  userModalName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  vipActions: {
    gap: theme.spacing.xs,
  },
  vipActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    gap: 6,
  },
  vipActionButtonDanger: {
    backgroundColor: theme.colors.error,
  },
  vipActionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: '#FFF',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  dangerButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
});
