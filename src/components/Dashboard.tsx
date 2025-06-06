
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Plus, LogOut, Disc } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArtistForm from "@/components/ArtistForm";
import TrackForm from "@/components/TrackForm";
import ArtistCard from "@/components/ArtistCard";

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

const Dashboard = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<string>("");
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

      setArtists(artistsData || []);
      setTracks(tracksData || []);
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

  const getTracksByArtist = (artistId: string) => {
    return tracks.filter(track => track.artist_id === artistId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

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
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Artistas
            </CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {artists.length}/2
            </div>
            <p className="text-xs text-gray-400">
              Limite máximo: 2 artistas
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
              Máximo 5 por artista
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Gêneros
            </CardTitle>
            <Disc className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Set([...artists.map(a => a.genre), ...tracks.map(t => t.genre)]).size}
            </div>
            <p className="text-xs text-gray-400">
              Gêneros únicos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => setShowArtistForm(true)}
          disabled={artists.length >= 2}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Artista
        </Button>
      </div>

      {/* Artists Grid */}
      <div className="space-y-6">
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
      </div>

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
    </div>
  );
};

export default Dashboard;
