// MODDESS TIPS - App Configuration

export const APP_CONFIG = {
  appName: 'MODDESS TIPS',
  tagline: 'Professional Sports Predictions',
  
  // Telegram links
  telegram: {
    admin: 'https://t.me/servant12r',
    channel: 'https://t.me/+EBiGK5As8NQ1MjI0',
  },
  
  // VIP pricing - UPDATED PRICES
  vipPricing: [
    {
      id: '1week',
      duration: '1 Week',
      price: 25,
      days: 7,
      popular: false,
    },
    {
      id: '1month',
      duration: '1 Month',
      price: 45,
      days: 30,
      popular: true,
    },
    {
      id: '1year',
      duration: '1 Year',
      price: 80,
      days: 365,
      popular: false,
    },
  ],
  
  // Prediction sections
  sections: {
    free: [
      { id: 'cote_2_free', label: 'Odds 2', icon: 'emoji-events' },
      { id: 'accumulation_free', label: 'Accumulator', icon: 'layers' },
    ],
    vip: [
      { id: 'cote_2_vip', label: 'Odds 2 VIP', icon: 'stars' },
      { id: 'cote_5_vip', label: 'Odds 5 VIP', icon: 'workspace-premium' },
      { id: 'score_exact_vip', label: 'Correct Score', icon: 'bullseye' },
      { id: 'ht_ft_vip', label: 'HT/FT', icon: 'schedule' },
    ],
  },
  
  // Status labels
  status: {
    pending: { label: 'Pending', color: '#3B82F6' },
    won: { label: 'Won', color: '#10B981' },
    lost: { label: 'Lost', color: '#EF4444' },
  },
  
  // Onboarding
  onboarding: [
    {
      title: 'Premium Predictions',
      description: 'Get access to exclusive VIP predictions with high success rates',
      image: require('@/assets/images/onboarding-1.png'),
    },
    {
      title: 'Real-Time Updates',
      description: 'Receive instant push notifications for new predictions and results',
      image: require('@/assets/images/onboarding-2.png'),
    },
    {
      title: 'Join & Win',
      description: 'Start winning today with our professional sports betting tips',
      image: require('@/assets/images/onboarding-3.png'),
    },
  ],
};
