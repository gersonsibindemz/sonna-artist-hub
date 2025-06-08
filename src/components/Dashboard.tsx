
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Users, Plus, LogOut, Disc, Clock, CheckCircle, XCircle, User, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArtistForm from "@/components/ArtistForm";
import TrackForm from "@/components/TrackForm";
import ArtistCard from "@/components/ArtistCard";
import UserProfile from "@/components/UserProfile";
import ProjectDetails from "@/components/ProjectDetails";

interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  image_url: string;
  account_type: string;
}

interface Track {
  id: string;
  title: string;
  duration: number;
  genre: string;
  artist_id: string;
  status: string;
  isrc_code: string;
  iswc_code: string;
  year: number;
  album: string;
  created_at: string;
  cover_art_url: string;
}

interface Approval {
  id: string;
  track_id: string;
  status: string;
  comments: string;
  reviewed_at: string;
}

const Dashboard = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: artistsData, error: artistsError } = await supabase
        .from("artists")
        .select("*")
        .order("created_at", { ascending: false });

      if (artistsError) throw artistsError;

      const { data: tracksData, error: tracksError } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (tracksError) throw tracksError;

      const { data: approvalsData, error: approvalsError } = await supabase
        .from("approvals")
        .select("*")
        .order("reviewed_at", { ascending: false });

      if (approvalsError) throw approvalsError;

      setArtists(artistsData || []);
      setTracks(tracksData || []);
      setApprovals(approvalsData || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddTrack = (artistId: string) => {
    setSelectedArtist(artistId);
    setShowTrackForm(true);
  };

  const handleViewProject = (trackId: string) => {
    setSelectedTrack(trackId);
    setShowProjectDetails(true);
  };

  const getTracksByArtist = (artistId: string) => {
    return tracks.filter(track => track.artist_id === artistId);
  };

  const getMaxArtists = () => {
    if (artists.length === 0) return 2;
    return artists[0]?.account_type === 'label' ? 5 : 2;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      default: return 'Pendente';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const pendingTracks = tracks.filter(track => track.status === 'pending');
  const approvedTracks = tracks.filter(track => track.status === 'approved');
  const rejectedTracks = tracks.filter(track => track.status === 'rejected');

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Sonna For Artists
          </h1>
          <p className="text-gray-300">Gerencie seus artistas e músicas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowUserProfile(true)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <User className="h-4 w-4 mr-2" />
            Perfil
          </Button>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Artistas
            </CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {artists.length}/{getMaxArtists()}
            </div>
            <p className="text-xs text-gray-400">
              {artists.length > 0 ? 
                `Conta ${artists[0]?.account_type === 'label' ? 'Label' : 'Artista'}` : 
                'Defina o tipo ao criar'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Faixas Aprovadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {approvedTracks.length}
            </div>
            <p className="text-xs text-gray-400">
              Disponíveis para streaming
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Aguardando Análise
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pendingTracks.length}
            </div>
            <p className="text-xs text-gray-400">
              Em revisão pelos analistas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total de Faixas
            </CardTitle>
            <Music className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {tracks.length}
            </div>
            <p className="text-xs text-gray-400">
              Sem limite por artista
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => setShowArtistForm(true)}
          disabled={artists.length >= getMaxArtists()}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Artista
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="artists" className="space-y-6">
        <TabsList className="bg-white/10 border-white/20">
          <TabsTrigger value="artists" className="data-[state=active]:bg-white/20">
            Artistas
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-white/20">
            Meus Projetos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artists" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Seus Artistas</h2>
          {artists.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-300 text-center">
                  Você ainda não tem artistas cadastrados.
                  <br />
                  Comece criando seu primeiro artista!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  tracks={getTracksByArtist(artist.id)}
                  onAddTrack={() => handleAddTrack(artist.id)}
                  onRefresh={fetchData}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Meus Projetos</h2>
          
          {tracks.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Music className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-300 text-center">
                  Você ainda não tem faixas cadastradas.
                  <br />
                  Adicione faixas através dos seus artistas!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingTracks.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    Aguardando Análise ({pendingTracks.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingTracks.map((track) => {
                      const artist = artists.find(a => a.id === track.artist_id);
                      return (
                        <Card key={track.id} className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                              onClick={() => handleViewProject(track.id)}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              {track.cover_art_url && (
                                <img src={track.cover_art_url} alt={track.title} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div className="flex-1 ml-3">
                                <CardTitle className="text-white text-lg">{track.title}</CardTitle>
                                <CardDescription className="text-gray-300">
                                  {artist?.name} • {track.genre}
                                </CardDescription>
                              </div>
                              <Badge className={getStatusColor(track.status)}>
                                {getStatusIcon(track.status)}
                                <span className="ml-1">{getStatusText(track.status)}</span>
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm text-gray-400">
                              <p><strong>ISRC:</strong> {track.isrc_code}</p>
                              <p><strong>ISWC:</strong> {track.iswc_code}</p>
                              <p><strong>Enviado:</strong> {formatDate(track.created_at)}</p>
                              {track.album && <p><strong>Álbum:</strong> {track.album}</p>}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {approvedTracks.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Aprovadas ({approvedTracks.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedTracks.map((track) => {
                      const artist = artists.find(a => a.id === track.artist_id);
                      const approval = approvals.find(a => a.track_id === track.id);
                      return (
                        <Card key={track.id} className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                              onClick={() => handleViewProject(track.id)}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              {track.cover_art_url && (
                                <img src={track.cover_art_url} alt={track.title} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div className="flex-1 ml-3">
                                <CardTitle className="text-white text-lg">{track.title}</CardTitle>
                                <CardDescription className="text-gray-300">
                                  {artist?.name} • {track.genre}
                                </CardDescription>
                              </div>
                              <Badge className={getStatusColor(track.status)}>
                                {getStatusIcon(track.status)}
                                <span className="ml-1">{getStatusText(track.status)}</span>
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm text-gray-400">
                              <p><strong>ISRC:</strong> {track.isrc_code}</p>
                              <p><strong>ISWC:</strong> {track.iswc_code}</p>
                              <p><strong>Aprovado:</strong> {approval ? formatDate(approval.reviewed_at) : 'N/A'}</p>
                              {track.album && <p><strong>Álbum:</strong> {track.album}</p>}
                            </div>
                            {approval?.comments && (
                              <div className="p-2 bg-green-500/10 border border-green-500/30 rounded">
                                <p className="text-green-200 text-sm">{approval.comments}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {rejectedTracks.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    Rejeitadas ({rejectedTracks.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rejectedTracks.map((track) => {
                      const artist = artists.find(a => a.id === track.artist_id);
                      const approval = approvals.find(a => a.track_id === track.id);
                      return (
                        <Card key={track.id} className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
                              onClick={() => handleViewProject(track.id)}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              {track.cover_art_url && (
                                <img src={track.cover_art_url} alt={track.title} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div className="flex-1 ml-3">
                                <CardTitle className="text-white text-lg">{track.title}</CardTitle>
                                <CardDescription className="text-gray-300">
                                  {artist?.name} • {track.genre}
                                </CardDescription>
                              </div>
                              <Badge className={getStatusColor(track.status)}>
                                {getStatusIcon(track.status)}
                                <span className="ml-1">{getStatusText(track.status)}</span>
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm text-gray-400">
                              <p><strong>ISRC:</strong> {track.isrc_code}</p>
                              <p><strong>ISWC:</strong> {track.iswc_code}</p>
                              <p><strong>Rejeitado:</strong> {approval ? formatDate(approval.reviewed_at) : 'N/A'}</p>
                              {track.album && <p><strong>Álbum:</strong> {track.album}</p>}
                            </div>
                            {approval?.comments && (
                              <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                                <p className="text-red-200 text-sm"><strong>Motivo:</strong> {approval.comments}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showArtistForm && (
        <ArtistForm
          onClose={() => setShowArtistForm(false)}
          onSuccess={() => {
            setShowArtistForm(false);
            fetchData();
          }}
        />
      )}

      {showTrackForm && (
        <TrackForm
          artistId={selectedArtist}
          onClose={() => setShowTrackForm(false)}
          onSuccess={() => {
            setShowTrackForm(false);
            fetchData();
          }}
        />
      )}

      {showUserProfile && (
        <UserProfile
          onClose={() => setShowUserProfile(false)}
        />
      )}

      {showProjectDetails && (
        <ProjectDetails
          trackId={selectedTrack}
          onClose={() => setShowProjectDetails(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
