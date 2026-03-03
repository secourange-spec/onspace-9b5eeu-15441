// MODDESS TIPS - Predictions Service
import { getSupabaseClient } from '@/template';

export interface Prediction {
  id: string;
  match: string;
  championship?: string;
  category: 'free' | 'vip';
  section: string;
  odds: string;
  confidence?: string;
  success_rate?: string;
  bet: string;
  advice?: string;
  status: 'pending' | 'won' | 'lost';
  match_date?: string;
  created_at: string;
  created_by?: string;
}

export interface HistoryEntry extends Prediction {
  archived_at: string;
}

const supabase = getSupabaseClient();

export const predictionsService = {
  // Get all active predictions
  async getActivePredictions(userIsVip: boolean): Promise<{ data: Prediction[] | null; error: string | null }> {
    try {
      let query = supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!userIsVip) {
        query = query.eq('category', 'free');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get predictions by section
  async getPredictionsBySection(section: string): Promise<{ data: Prediction[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('section', section)
        .eq('status', 'pending')
        .order('match_date', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Create prediction (admin only)
  async createPrediction(prediction: Omit<Prediction, 'id' | 'created_at'>): Promise<{ data: Prediction | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .insert([prediction])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update prediction status (admin only)
  async updatePredictionStatus(id: string, status: 'pending' | 'won' | 'lost'): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('predictions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Move to history (admin only)
  async moveToHistory(predictionId: string): Promise<{ error: string | null }> {
    try {
      // Get the prediction
      const { data: prediction, error: fetchError } = await supabase
        .from('predictions')
        .select('*')
        .eq('id', predictionId)
        .single();
      
      if (fetchError) throw fetchError;
      if (!prediction) throw new Error('Prediction not found');

      // Insert into history
      const { error: insertError } = await supabase
        .from('history')
        .insert([{
          id: prediction.id,
          match: prediction.match,
          championship: prediction.championship,
          category: prediction.category,
          section: prediction.section,
          odds: prediction.odds,
          confidence: prediction.confidence,
          success_rate: prediction.success_rate,
          bet: prediction.bet,
          advice: prediction.advice,
          status: prediction.status,
          match_date: prediction.match_date,
          created_at: prediction.created_at,
          created_by: prediction.created_by,
        }]);
      
      if (insertError) throw insertError;

      // Delete from predictions
      const { error: deleteError } = await supabase
        .from('predictions')
        .delete()
        .eq('id', predictionId);
      
      if (deleteError) throw deleteError;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Delete prediction (admin only)
  async deletePrediction(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('predictions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Get history by section
  async getHistoryBySection(section: string, status?: 'won' | 'lost' | 'all'): Promise<{ data: HistoryEntry[] | null; error: string | null }> {
    try {
      let query = supabase
        .from('history')
        .select('*')
        .eq('section', section)
        .order('archived_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get history
  async getHistory(userIsVip: boolean, filters?: { status?: string; section?: string }): Promise<{ data: HistoryEntry[] | null; error: string | null }> {
    try {
      let query = supabase
        .from('history')
        .select('*')
        .order('archived_at', { ascending: false });
      
      if (!userIsVip) {
        query = query.eq('category', 'free');
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.section && filters.section !== 'all') {
        query = query.eq('section', filters.section);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get all history (admin only)
  async getAllHistory(): Promise<{ data: HistoryEntry[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('archived_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Delete history entry (admin only)
  async deleteHistory(historyId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('id', historyId);
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
