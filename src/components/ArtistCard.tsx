
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Plus, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  image_url: string;
}

interface Track {
  id: string;
  title: string;
  duration: number;
  genre: string;
  artist_id: string;
}

interface ArtistCardProps {
  artist: Artist;
  tracks: Track[];
  onAddTrack: () => void;
  onRefresh: () => void;
}

const ArtistCard = ({ artist, tracks, onAddTrack, onRefresh }: ArtistCardProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteTrack = async (trackId: string, trackTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${trackTitle}"?`)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("tracks")
        .delete()
        .eq("id", trackId);

      if (error) throw error;

      toast({
        title: "Faixa excluída",
        description: `"${trackTitle}" foi removida com sucesso.`,
      });

      onRefresh();
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
      <CardHeader>
        <div className="flex items-start gap-4">
          {artist.image_url ? (
            <img
              src={artist.image_url}
              alt={artist.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
              <Music className="h-8 w-8 text-black" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-white">{artist.name}</CardTitle>
            <CardDescription className="text-gray-300">
              {artist.genre && (
                <Badge variant="secondary" className="mb-2">
                  {artist.genre}
                </Badge>
              )}
              {artist.bio && <p className="text-sm">{artist.bio}</p>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex justify-between text-sm text-gray-300">
            <span>{tracks.length}/5 faixas</span>
            <span>{tracks.reduce((acc, track) => acc + track.duration, 0)} segundos total</span>
          </div>

          {/* Tracks List */}
          {tracks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Faixas:</h4>
              {tracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{track.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {track.genre && <span>{track.genre}</span>}
                      {track.duration && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(track.duration)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTrack(track.id, track.title)}
                    disabled={loading}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Track Button */}
          <Button
            onClick={onAddTrack}
            disabled={tracks.length >= 5}
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            {tracks.length >= 5 ? "Limite atingido" : "Adicionar Faixa"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
