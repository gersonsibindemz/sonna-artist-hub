
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
      const response = await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/tracks?artist_id=eq.${artistId}&order=created_at.desc`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTracks(data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar faixas:", error);
    }
  };

  const deleteTrack = async (trackId: string, trackTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${trackTitle}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/tracks?id=eq.${trackId}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Faixa excluída",
          description: `"${trackTitle}" foi removida com sucesso.`,
        });
        fetchTracks();
      } else {
        throw new Error('Erro ao excluir faixa');
      }
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
