// MODDESS TIPS - Professional Blue & White Design System

export const theme = {
  colors: {
    // Background colors
    background: '#F8FAFC',          // Light gray background
    surface: '#FFFFFF',             // Pure white
    surfaceLight: '#EFF6FF',        // Light blue tint
    
    // Text colors
    textPrimary: '#0F172A',         // Dark blue-black
    textSecondary: '#475569',       // Medium gray
    textMuted: '#94A3B8',           // Light gray
    
    // Brand colors - BLUE THEME
    primary: '#1E40AF',             // Deep blue (primary)
    primaryLight: '#3B82F6',        // Bright blue
    primaryDark: '#1E3A8A',         // Dark blue
    vipBlue: '#3B82F6',             // VIP blue
    vipGradientStart: '#1E40AF',    // Gradient start
    vipGradientEnd: '#3B82F6',      // Gradient end
    
    // Semantic colors
    success: '#10B981',             // Green
    error: '#EF4444',               // Red
    warning: '#F59E0B',             // Orange
    info: '#3B82F6',                // Blue
    
    // UI colors
    border: '#E2E8F0',              // Light border
    overlay: 'rgba(0, 0, 0, 0.5)',  // Dark overlay
    badge: '#DC2626',               // Red badge for notifications
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    normal: '400' as any,
    medium: '500' as any,
    semibold: '600' as any,
    bold: '700' as any,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 999,
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    blue: {
      shadowColor: '#1E40AF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};
