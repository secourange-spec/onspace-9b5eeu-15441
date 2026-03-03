// MODDESS TIPS - Users Service
import { getSupabaseClient } from '@/template';

export interface UserProfile {
  id: string;
  username?: string;
  email: string;
  role: 'user' | 'admin';
  vip_status: boolean;
  vip_expire_date?: string;
  banned: boolean;
  created_at: string;
}

const supabase = getSupabaseClient();

export const usersService = {
  // Get current user profile (using provided userId or current session)
  async getCurrentUserProfile(userId?: string): Promise<{ data: UserProfile | null; error: string | null }> {
    try {
      let targetUserId = userId;
      
      // If no userId provided, get from current session
      if (!targetUserId) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('[usersService] ❌ No authenticated user:', authError?.message);
          return { data: null, error: 'Non authentifié' };
        }
        targetUserId = user.id;
      }

      console.log('[usersService] 🔍 Fetching profile for userId:', targetUserId);

      // Try to fetch the profile
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', targetUserId)
        .maybeSingle();
      
      if (error) {
        console.error('[usersService] ❌ Database error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return { data: null, error: error.message };
      }
      
      // Profile exists - return it
      if (data) {
        console.log('[usersService] ✅ Profile loaded successfully:', {
          email: data.email,
          username: data.username,
          role: data.role,
          vip: data.vip_status
        });
        return { data, error: null };
      }
      
      // Profile doesn't exist - this shouldn't happen with triggers, but handle it
      console.warn('[usersService] ⚠️ Profile not found, trigger may have failed');
      console.log('[usersService] 🔧 Attempting to create profile manually...');
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        console.error('[usersService] ❌ Cannot create profile - no auth user');
        return { data: null, error: 'Session invalide' };
      }

      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          username: authUser.email!.split('@')[0],
          role: 'user',
          vip_status: false,
          banned: false,
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('[usersService] ❌ Failed to create profile:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details
        });
        return { data: null, error: `Erreur création profil: ${insertError.message}` };
      }
      
      console.log('[usersService] ✅ Profile created successfully:', newProfile.email);
      return { data: newProfile, error: null };
      
    } catch (error: any) {
      console.error('[usersService] ❌ Unexpected exception:', error);
      return { data: null, error: `Erreur inattendue: ${error.message}` };
    }
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<{ data: UserProfile[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update VIP status (admin only)
  async updateVipStatus(userId: string, vipStatus: boolean, expireDate?: string): Promise<{ error: string | null }> {
    try {
      const updateData: any = { vip_status: vipStatus };
      if (expireDate) {
        updateData.vip_expire_date = expireDate;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Ban/unban user (admin only)
  async updateBanStatus(userId: string, banned: boolean): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ banned })
        .eq('id', userId);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Check VIP expiration
  isVipActive(profile: UserProfile): boolean {
    if (!profile.vip_status) return false;
    if (!profile.vip_expire_date) return true; // No expiration date means permanent VIP
    
    const expireDate = new Date(profile.vip_expire_date);
    const now = new Date();
    return expireDate > now;
  },
};
