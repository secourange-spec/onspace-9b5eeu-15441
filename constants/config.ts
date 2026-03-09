// MODDESS TIPS - Application Configuration
export const APP_CONFIG = {
  appName: 'MODDESS TIPS',
  version: '2.0.0',
  
  telegram: {
    admin: 'https://t.me/moddesstips',
    channel: 'https://t.me/+EBiGK5As8NQ1MjI0',
  },
  
  vipPricing: [
    {
      id: 'week',
      duration: '1 Week',
      price: 25,
      days: 7,
      popular: false,
    },
    {
      id: 'month',
      duration: '1 Month',
      price: 45,
      days: 30,
      popular: true,
    },
    {
      id: '3months',
      duration: '3 Months',
      price: 80,
      days: 90,
      popular: false,
    },
  ],
} as const;
