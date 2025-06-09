
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Track } from "@/types/track";

export const useTracks = (artistId: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTracks();
  }, [artistId]);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTracks(data || []);
    } catch (error) {
      console.error("Erro ao buscar faixas:", error);
    }
  };

  const deleteTrack = async (trackId: string, trackTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${trackTitle}"?`)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId);

      if (error) {
        throw error;
      }

      toast({
        title: "Faixa excluída",
        description: `"${trackTitle}" foi removida com sucesso.`,
      });
      fetchTracks();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir faixa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    tracks,
    loading,
    deleteTrack,
    refetchTracks: fetchTracks
  };
};
