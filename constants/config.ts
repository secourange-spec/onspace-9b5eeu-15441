// MODDESS TIPS - App Configuration

export const APP_CONFIG = {
  appName: 'MODDESS TIPS',
  tagline: 'Pronostics Sportifs Professionnels',
  
  // Telegram links
  telegram: {
    admin: 'https://t.me/servant12r',
    channel: 'https://t.me/+EBiGK5As8NQ1MjI0',
  },
  
  // VIP pricing
  vipPricing: [
    {
      id: '1week',
      duration: '1 Semaine',
      price: 15,
      days: 7,
      popular: false,
    },
    {
      id: '1month',
      duration: '1 Mois',
      price: 30,
      days: 30,
      popular: true,
    },
    {
      id: '3months',
      duration: '3 Mois',
      price: 50,
      days: 90,
      popular: false,
    },
  ],
  
  // Prediction sections
  sections: {
    free: [
      { id: 'cote_2_free', label: 'Côte 2', icon: 'emoji-events' },
      { id: 'accumulation_free', label: 'Accumulation', icon: 'layers' },
    ],
    vip: [
      { id: 'cote_2_vip', label: 'Côte 2 VIP', icon: 'stars' },
      { id: 'cote_5_vip', label: 'Côte 5 VIP', icon: 'workspace-premium' },
      { id: 'score_exact_vip', label: 'Score Exact', icon: 'bullseye' },
      { id: 'ht_ft_vip', label: 'HT/FT', icon: 'schedule' },
    ],
  },
  
  // Status labels
  status: {
    pending: { label: 'En cours', color: '#3B82F6' },
    won: { label: 'Gagné', color: '#10B981' },
    lost: { label: 'Perdu', color: '#EF4444' },
  },
};
