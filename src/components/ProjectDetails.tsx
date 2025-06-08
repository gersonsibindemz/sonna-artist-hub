
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Music, Calendar, Clock, User, Hash, Globe } from "lucide-react";
import PlatformSubmissions from "./PlatformSubmissions";

interface Track {
  id: string;
  title: string;
  duration: number;
  genre: string;
  album: string;
  year: number;
  status: string;
  isrc_code: string;
  iswc_code: string;
  created_at: string;
  cover_art_url: string;
  file_format: string;
  bit_rate: number;
  sample_rate: number;
  language: string;
  lyrics: string;
  composer: string;
  lyricist: string;
  publisher: string;
  copyright_holder: string;
  record_label: string;
  release_date: string;
  recording_date: string;
  track_type: string;
  track_number: number;
  artists: {
    name: string;
    genre: string;
  };
}

interface ProjectDetailsProps {
  trackId: string;
  onClose: () => void;
}

const ProjectDetails = ({ trackId, onClose }: ProjectDetailsProps) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackDetails();
  }, [trackId]);

  const fetchTrackDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("tracks")
        .select(`
          *,
          artists (
            name,
            genre
          )
        `)
        .eq("id", trackId)
        .single();

      if (error) throw error;
      setTrack(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!track) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {track.cover_art_url && (
                  <img
                    src={track.cover_art_url}
                    alt={track.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div>
                  <CardTitle className="text-white text-2xl flex items-center gap-2">
                    <Music className="h-6 w-6" />
                    {track.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    {track.artists.name} • {track.genre}
                  </CardDescription>
                  <Badge className={`${getStatusColor(track.status)} mt-2`}>
                    {track.status === 'approved' ? 'Aprovada' : 
                     track.status === 'rejected' ? 'Rejeitada' : 'Pendente'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Informações da Faixa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duração:</span>
                    <span className="text-white">{formatDuration(track.duration || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Formato:</span>
                    <span className="text-white">{track.file_format || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bit Rate:</span>
                    <span className="text-white">{track.bit_rate ? `${track.bit_rate} kbps` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sample Rate:</span>
                    <span className="text-white">{track.sample_rate ? `${track.sample_rate} Hz` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Idioma:</span>
                    <span className="text-white">{track.language || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Códigos e Identificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ISRC:</span>
                    <span className="text-white font-mono">{track.isrc_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ISWC:</span>
                    <span className="text-white font-mono">{track.iswc_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-white">{track.track_type || 'Single'}</span>
                  </div>
                  {track.track_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nº da Faixa:</span>
                      <span className="text-white">{track.track_number}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Datas e Lançamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ano:</span>
                    <span className="text-white">{track.year || 'N/A'}</span>
                  </div>
                  {track.release_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lançamento:</span>
                      <span className="text-white">{new Date(track.release_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  {track.recording_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gravação:</span>
                      <span className="text-white">{new Date(track.recording_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submetido:</span>
                    <span className="text-white">{new Date(track.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informações de Álbum */}
            {track.album && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Informações do Álbum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Álbum:</span>
                    <span className="text-white">{track.album}</span>
                  </div>
                  {track.record_label && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gravadora:</span>
                      <span className="text-white">{track.record_label}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Créditos */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Créditos e Direitos
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {track.composer && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Compositor:</span>
                    <span className="text-white">{track.composer}</span>
                  </div>
                )}
                {track.lyricist && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Letrista:</span>
                    <span className="text-white">{track.lyricist}</span>
                  </div>
                )}
                {track.publisher && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Editor:</span>
                    <span className="text-white">{track.publisher}</span>
                  </div>
                )}
                {track.copyright_holder && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Detentor dos Direitos:</span>
                    <span className="text-white">{track.copyright_holder}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Letra */}
            {track.lyrics && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Letra</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white whitespace-pre-line text-sm leading-relaxed">
                    {track.lyrics}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Plataformas de Streaming */}
            {track.status === 'approved' && (
              <PlatformSubmissions trackId={track.id} trackTitle={track.title} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
