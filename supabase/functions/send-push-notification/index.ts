// MODDESS TIPS - Send Push Notification Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { title, message, data } = await req.json();

    // Validate inputs
    if (!title || !message) {
      return new Response(
        JSON.stringify({ error: 'Title and message are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get all users with push tokens
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('push_token')
      .not('push_token', 'is', null)
      .not('push_token', 'eq', '');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return new Response(
        JSON.stringify({ error: usersError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users with push tokens found', sent: 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare push notification messages for Expo
    const messages = users.map((user) => ({
      to: user.push_token,
      sound: 'default',
      title,
      body: message,
      data: data || {},
    }));

    // Send push notifications via Expo Push API
    const chunks = chunkArray(messages, 100); // Expo allows max 100 per request
    let successCount = 0;
    let errorCount = 0;

    for (const chunk of chunks) {
      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chunk),
        });

        const result = await response.json();
        
        if (response.ok) {
          successCount += chunk.length;
          console.log(`Successfully sent ${chunk.length} notifications`);
        } else {
          errorCount += chunk.length;
          console.error('Expo push error:', result);
        }
      } catch (error) {
        errorCount += chunk.length;
        console.error('Error sending chunk:', error);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Push notifications sent',
        sent: successCount,
        failed: errorCount,
        total: users.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to chunk array
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
