
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { trackId, title, artist, isrcCode, iswcCode } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Simulate validation against external APIs (MusicBrainz, Deezer, etc.)
    const duplicateChecks = []

    // Check MusicBrainz (simulado)
    try {
      const musicBrainzResponse = await fetch(
        `https://musicbrainz.org/ws/2/recording?query=title:"${encodeURIComponent(title)}" AND artist:"${encodeURIComponent(artist)}"&fmt=json`
      )
      
      if (musicBrainzResponse.ok) {
        const data = await musicBrainzResponse.json()
        if (data.recordings && data.recordings.length > 0) {
          duplicateChecks.push({
            platform: 'MusicBrainz',
            found: true,
            details: data.recordings[0],
            similarity: 0.9
          })
        }
      }
    } catch (error) {
      console.error('MusicBrainz API error:', error)
    }

    // Se encontrou duplicatas, registrar notificação
    for (const check of duplicateChecks) {
      if (check.found) {
        await supabaseClient
          .from('duplicate_notifications')
          .insert({
            track_id: trackId,
            external_platform: check.platform,
            external_id: check.details?.id || 'unknown',
            similarity_score: check.similarity,
            details: check.details,
            status: 'pending'
          })
      }
    }

    return new Response(
      JSON.stringify({ 
        duplicatesFound: duplicateChecks.filter(c => c.found).length,
        checks: duplicateChecks
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Duplicate validation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to validate duplicates' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
