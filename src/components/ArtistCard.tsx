
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Plus, Clock, Trash2, CheckCircle, XCircle, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Artist } from "@/types/auth";

interface Track {
  id: string;
  title: string;
  duration: number;
  genre: string;
  artist_id: string;
  status: string;
  isrc_code?: string;
  iswc_code?: string;
}

interface ArtistCardProps {
  artist: Artist;
  onEdit: () => void;
  onAddTrack: () => void;
  onViewDetails: () => void;
}

const ArtistCard = ({ artist, onEdit, onAddTrack, onViewDetails }: ArtistCardProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchTracks();
  }, [artist.id]);

  const fetchTracks = async () => {
    try {
      const response = await fetch(`https://kqivlifcqykagpecjawk.supabase.co/rest/v1/tracks?artist_id=eq.${artist.id}&order=created_at.desc`, {
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

  const handleDeleteTrack = async (trackId: string, trackTitle: string) => {
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'rejected': return <XCircle className="h-3 w-3 text-red-400" />;
      default: return <Clock className="h-3 w-3 text-yellow-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      default: return 'Pendente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const pendingTracks = tracks.filter(t => t.status === 'pending');
  const approvedTracks = tracks.filter(t => t.status === 'approved');
  const rejectedTracks = tracks.filter(t => t.status === 'rejected');

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
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">{artist.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-300">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {artist.genre && (
                  <Badge variant="secondary">
                    {artist.genre}
                  </Badge>
                )}
                <Badge variant={artist.account_type === 'label' ? 'default' : 'outline'}>
                  {artist.account_type === 'label' ? 'Label' : 'Artista'}
                </Badge>
              </div>
              {artist.bio && <p className="text-sm">{artist.bio}</p>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-lg font-bold text-white">{tracks.length}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-lg font-bold text-green-400">{approvedTracks.length}</div>
              <div className="text-xs text-gray-400">Aprovadas</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-lg font-bold text-yellow-400">{pendingTracks.length}</div>
              <div className="text-xs text-gray-400">Pendentes</div>
            </div>
          </div>

          {/* Tracks List */}
          {tracks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Faixas:</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {tracks.map((track) => (
                  <div key={track.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium truncate">{track.title}</p>
                        {getStatusIcon(track.status)}
                      </div>
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
                        <span>•</span>
                        <span className={getStatusColor(track.status)}>
                          {getStatusText(track.status)}
                        </span>
                      </div>
                      {track.isrc_code && (
                        <div className="text-xs text-gray-500 mt-1">
                          ISRC: {track.isrc_code}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTrack(track.id, track.title)}
                      disabled={loading}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Track Button */}
          <Button
            onClick={onAddTrack}
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Faixa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
