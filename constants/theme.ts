// MODDESS TIPS - Design System (Thème Clair)

export const theme = {
  colors: {
    // Background colors
    background: '#F8FAFC',          // Gris très clair
    surface: '#FFFFFF',             // Blanc pur
    surfaceLight: '#F1F5F9',        // Gris clair
    
    // Text colors
    textPrimary: '#0F172A',         // Noir bleuté
    textSecondary: '#475569',       // Gris foncé
    textMuted: '#94A3B8',           // Gris moyen
    
    // Brand colors
    primary: '#FFD700',             // Or
    primaryDark: '#FFC700',         // Or foncé
    vipGold: '#FFD700',             // Or VIP
    vipGradientStart: '#FFD700',    // Dégradé or début
    vipGradientEnd: '#FFA500',      // Dégradé or fin
    
    // Semantic colors
    success: '#10B981',             // Vert
    error: '#EF4444',               // Rouge
    warning: '#F59E0B',             // Orange
    info: '#3B82F6',                // Bleu
    
    // UI colors
    border: '#E2E8F0',              // Bordure claire
    overlay: 'rgba(0, 0, 0, 0.5)',  // Overlay foncé
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
    gold: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};
