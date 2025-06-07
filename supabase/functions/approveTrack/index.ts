
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== Deno.env.get('ANALYST_API_KEY')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { trackId, analystId, comments } = await req.json()

    if (!trackId) {
      return new Response(
        JSON.stringify({ error: 'Track ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update track status to approved
    const { error: trackError } = await supabaseClient
      .from('tracks')
      .update({ status: 'approved' })
      .eq('id', trackId)

    if (trackError) {
      console.error('Error updating track status:', trackError)
      return new Response(
        JSON.stringify({ error: 'Failed to approve track' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create approval record
    const { error: approvalError } = await supabaseClient
      .from('approvals')
      .insert({
        track_id: trackId,
        analyst_id: analystId,
        status: 'approved',
        comments: comments || null,
        reviewed_at: new Date().toISOString()
      })

    if (approvalError) {
      console.error('Error creating approval record:', approvalError)
      return new Response(
        JSON.stringify({ error: 'Failed to create approval record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Track approved successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
