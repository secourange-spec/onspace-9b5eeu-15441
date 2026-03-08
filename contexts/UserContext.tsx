// MODDESS TIPS - User Context with Push Notifications
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/template';
import { usersService, UserProfile } from '@/services/users';
import { pushNotificationsService } from '@/services/pushNotifications';

interface UserContextType {
  profile: UserProfile | null;
  isVip: boolean;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Register for push notifications
  const registerPushNotifications = async () => {
    if (!user?.id) return;

    const { token, error } = await pushNotificationsService.registerForPushNotifications();
    if (error) {
      console.warn('[UserContext] Push notification registration failed:', error);
      return;
    }

    if (token) {
      console.log('[UserContext] ✅ Push token received:', token);
      await pushNotificationsService.savePushToken(user.id, token);
    }
  };

  const loadProfile = async () => {
    console.log('\n========================================');
    console.log('[UserContext] 🔄 LOAD PROFILE CALLED');
    console.log('[UserContext] User state:', user ? {
      id: user.id,
      email: user.email,
      hasSession: true
    } : 'NO USER');
    console.log('========================================\n');
    
    if (!user?.id) {
      console.log('[UserContext] ❌ No user.id, clearing profile and stopping');
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('[UserContext] ⏳ Setting loading = true');
    setLoading(true);
    
    try {
      console.log('[UserContext] 📞 Calling usersService.getCurrentUserProfile with userId:', user.id);
      const { data, error } = await usersService.getCurrentUserProfile(user.id);
      
      console.log('[UserContext] 📥 Service response:', { hasData: !!data, error });
      
      if (error) {
        console.error('[UserContext] ❌ SERVICE RETURNED ERROR:', error);
        setProfile(null);
      } else if (data) {
        console.log('[UserContext] ✅ SUCCESS - Setting profile:', {
          email: data.email,
          username: data.username,
          role: data.role,
          vip: data.vip_status,
          banned: data.banned
        });
        setProfile(data);
        
        // Register for push notifications after profile is loaded
        registerPushNotifications();
      } else {
        console.warn('[UserContext] ⚠️ NO ERROR BUT NO DATA - This should not happen');
        setProfile(null);
      }
    } catch (err: any) {
      console.error('[UserContext] ❌ EXCEPTION CAUGHT:', err.message || err);
      console.error('[UserContext] Exception details:', err);
      setProfile(null);
    } finally {
      console.log('[UserContext] ⏹️ Setting loading = false');
      setLoading(false);
      console.log('[UserContext] Final profile state:', profile ? 'HAS PROFILE' : 'NO PROFILE');
    }
  };

  // Listen to auth user changes - depend on user.id for better stability
  useEffect(() => {
    console.log('[UserContext] useEffect triggered, user.id:', user?.id || 'null');
    loadProfile();
  }, [user?.id]);

  const isVip = profile ? usersService.isVipActive(profile) : false;
  const isAdmin = profile?.role === 'admin';

  return (
    <UserContext.Provider
      value={{
        profile,
        isVip,
        isAdmin,
        loading,
        refreshProfile: loadProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
