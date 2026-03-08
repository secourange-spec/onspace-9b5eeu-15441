// MODDESS TIPS - User Context (FIXED - No Console Logs)
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

  const registerPushNotifications = async () => {
    if (!user?.id) return;

    const { token } = await pushNotificationsService.registerForPushNotifications();
    if (token) {
      await pushNotificationsService.savePushToken(user.id, token);
    }
  };

  const loadProfile = async () => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await usersService.getCurrentUserProfile(user.id);
      
      if (error) {
        setProfile(null);
      } else if (data) {
        setProfile(data);
        registerPushNotifications();
      } else {
        setProfile(null);
      }
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Watch for auth user changes
  useEffect(() => {
    loadProfile();
  }, [user]);

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
