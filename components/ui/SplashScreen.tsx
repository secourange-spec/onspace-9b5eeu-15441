// MODDESS TIPS - Professional Animated Splash Screen
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { theme } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Text animations
  const leftTextAnim = useRef(new Animated.Value(-width)).current;
  const rightTextAnim = useRef(new Animated.Value(width)).current;
  const mergeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Text fusion animation
    setTimeout(() => {
      Animated.sequence([
        // Move texts from sides
        Animated.parallel([
          Animated.timing(leftTextAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(rightTextAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Merge effect
        Animated.timing(mergeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[theme.colors.vipGradientStart, theme.colors.vipGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
            },
          ]}
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            contentFit="contain"
            transition={200}
          />
        </Animated.View>

        {/* Animated Text */}
        <View style={styles.textContainer}>
          <Animated.View
            style={[
              styles.textWrapper,
              {
                opacity: mergeAnim,
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.appName,
                {
                  transform: [{ translateX: leftTextAnim }],
                  opacity: fadeAnim,
                },
              ]}
            >
              MODDESS
            </Animated.Text>
            <Animated.Text
              style={[
                styles.appName,
                styles.appNameRight,
                {
                  transform: [{ translateX: rightTextAnim }],
                  opacity: fadeAnim,
                },
              ]}
            >
              {' '}TIPS
            </Animated.Text>
          </Animated.View>
        </View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: mergeAnim,
            },
          ]}
        >
          Professional Sports Predictions
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...theme.shadows.large,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    height: 60,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appNameRight: {
    color: '#E0F2FE',
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
