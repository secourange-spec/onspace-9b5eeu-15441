// MODDESS TIPS - Login/Register Screen (ULTRA FIXED)
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth, useAlert } from '@/template';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const ONBOARDING_KEY = '@moddess_onboarding_complete';

export default function AuthScreen() {
  const { signInWithPassword, signUpWithPassword, sendOTP, verifyOTPAndLogin, operationLoading } = useAuth();
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
      showAlert('Error', 'Please enter email and password');
      return;
    }

    const { error, user } = await signInWithPassword(email.trim().toLowerCase(), password);
    
    if (error) {
      // Better error messages
      if (error.includes('Invalid login credentials')) {
        showAlert('Login Failed', 'Incorrect email or password. Please check your credentials or sign up for a new account.');
      } else if (error.includes('Email not confirmed')) {
        showAlert('Email Not Verified', 'Please check your email and verify your account before logging in.');
      } else {
        showAlert('Login Error', error);
      }
      return;
    }

    // Success - AuthRouter will handle navigation
    console.log('Login successful, user:', user?.email);
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

    const { error } = await sendOTP(email.trim().toLowerCase());
    if (error) {
      if (error.includes('User already registered')) {
        showAlert('Account Exists', 'This email is already registered. Please use the Login tab.');
        setIsLogin(true);
      } else {
        showAlert('Error', error);
      }
      return;
    }

    setOtpSent(true);
    showAlert('Code Sent', 'A 4-digit verification code has been sent to your email. Please check your inbox.');
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      showAlert('Error', 'Please enter the 4-digit verification code');
      return;
    }

    const { error, user } = await verifyOTPAndLogin(email.trim().toLowerCase(), otp, { password });
    
    if (error) {
      if (error.includes('Token has expired')) {
        showAlert('Code Expired', 'The verification code has expired. Please request a new code.');
        setOtpSent(false);
        setOtp('');
      } else if (error.includes('Invalid token')) {
        showAlert('Invalid Code', 'The verification code is incorrect. Please try again.');
      } else {
        showAlert('Error', error);
      }
      return;
    }

    // Success - AuthRouter will handle navigation
    console.log('Registration successful, user:', user?.email);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
                setEmail('');
                setPassword('');
                setConfirmPassword('');
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
                setEmail('');
                setPassword('');
                setConfirmPassword('');
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
                placeholder="your@email.com"
                placeholderTextColor={theme.colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!otpSent && !operationLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={theme.colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 characters"
                placeholderTextColor={theme.colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!otpSent && !operationLoading}
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
                  editable={!operationLoading}
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
                  editable={!operationLoading}
                />
              </View>
              <Text style={styles.hint}>Check your email for the verification code</Text>
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
                <Text style={styles.buttonText}>Please wait...</Text>
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Sign In' : otpSent ? 'Verify & Create Account' : 'Send Verification Code'}
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* OTP Resend */}
          {!isLogin && otpSent && (
            <Pressable 
              style={styles.resendButton} 
              onPress={handleSendOTP}
              disabled={operationLoading}
            >
              <Text style={styles.resendText}>Resend Code</Text>
            </Pressable>
          )}

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <MaterialIcons name="info-outline" size={16} color={theme.colors.textMuted} />
            <Text style={styles.helpText}>
              {isLogin 
                ? "Don't have an account? Use Sign Up tab" 
                : 'Already have an account? Use Login tab'}
            </Text>
          </View>
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
  hint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
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
    fontWeight: theme.fontWeight.semibold,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: theme.spacing.sm,
  },
  helpText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
});
