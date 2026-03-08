// MODDESS TIPS - Login/Register Screen

const ONBOARDING_KEY = '@moddess_onboarding_complete';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth, useAlert } from '@/template';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const { signInWithPassword, signUpWithPassword, sendOTP, verifyOTPAndLogin, operationLoading } = useAuth();
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();

  // Mark onboarding as complete when reaching login
  useEffect(() => {
    AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    console.log('[Login] Attempting login with email:', email);
    
    try {
      const { error, user } = await signInWithPassword(email, password);
      
      console.log('[Login] Response:', { error: error || 'none', hasUser: !!user });
      
      if (error) {
        console.error('[Login] Login failed:', error);
        showAlert('Login Failed', error);
        return;
      }
      
      if (!user) {
        console.error('[Login] No user returned despite no error');
        showAlert('Error', 'Login failed. Please try again.');
        return;
      }
      
      console.log('[Login] ✅ Login successful for:', user.email);
    } catch (err: any) {
      console.error('[Login] Exception during login:', err);
      showAlert('Error', err.message || 'An unexpected error occurred');
    }
  };

  const handleSendOTP = async () => {
    if (!email || !password || !confirmPassword) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters');
      return;
    }

    const { error } = await sendOTP(email);
    if (error) {
      showAlert('Error', error);
      return;
    }

    setOtpSent(true);
    showAlert('Code Sent', 'A verification code has been sent to your email');
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      showAlert('Error', 'Please enter the verification code');
      return;
    }

    console.log('[Login] Verifying OTP for:', email);
    
    try {
      const { error, user } = await verifyOTPAndLogin(email, otp, { password });
      
      if (error) {
        console.error('[Login] OTP verification failed:', error);
        showAlert('Verification Failed', error);
        return;
      }
      
      if (!user) {
        showAlert('Error', 'Verification failed. Please try again.');
        return;
      }
      
      console.log('[Login] ✅ OTP verified and user created');
    } catch (err: any) {
      console.error('[Login] Exception during OTP verification:', err);
      showAlert('Error', err.message || 'An unexpected error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <MaterialIcons name="sports-soccer" size={40} color="#000" />
          </LinearGradient>
          <Text style={styles.title}>{APP_CONFIG.appName}</Text>
          <Text style={styles.subtitle}>Professional Sports Predictions</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => {
                setIsLogin(true);
                setOtpSent(false);
                setOtp('');
              }}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Login</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => {
                setIsLogin(false);
                setOtpSent(false);
                setOtp('');
              }}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
            </Pressable>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color={theme.colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor={theme.colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!otpSent}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={theme.colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 characters"
                placeholderTextColor={theme.colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!otpSent}
              />
            </View>
          </View>

          {/* Confirm Password (Register only) */}
          {!isLogin && !otpSent && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>
          )}

          {/* OTP Input (Register only after OTP sent) */}
          {!isLogin && otpSent && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="verified" size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 4-digit code"
                  placeholderTextColor={theme.colors.textMuted}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>
          )}

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              operationLoading && styles.buttonDisabled,
            ]}
            onPress={() => {
              if (isLogin) {
                handleLogin();
              } else if (!otpSent) {
                handleSendOTP();
              } else {
                handleVerifyOTP();
              }
            }}
            disabled={operationLoading}
          >
            <LinearGradient
              colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {operationLoading ? (
                <Text style={styles.buttonText}>Loading...</Text>
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Sign In' : otpSent ? 'Verify Code' : 'Send Code'}
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* OTP Resend */}
          {!isLogin && otpSent && (
            <Pressable style={styles.resendButton} onPress={handleSendOTP}>
              <Text style={styles.resendText}>Resend Code</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
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
  },
  form: {
    gap: theme.spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginBottom: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.surfaceLight,
  },
  tabText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.textPrimary,
  },
  inputGroup: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
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
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    includeFontPadding: false,
  },
  button: {
    marginTop: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  buttonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: '#000',
  },
  resendButton: {
    alignSelf: 'center',
    paddingVertical: theme.spacing.sm,
  },
  resendText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
