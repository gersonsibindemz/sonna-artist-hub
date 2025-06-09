
import DashboardHeader from "@/components/DashboardHeader";
import DashboardStats from "@/components/DashboardStats";
import ArtistCard from "@/components/ArtistCard";
import ArtistForm from "@/components/ArtistForm";
import TrackForm from "@/components/TrackForm";
import ProjectDetails from "@/components/ProjectDetails";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Artist } from "@/types/auth";

const Dashboard = () => {
  const { user } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchArtists();
    }
  }, [user]);

  const fetchArtists = async () => {
    try {
      console.log('Fetching artists for user:', user?.id);
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Artists fetched:', data);
      setArtists(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar artistas:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar artistas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArtistSuccess = () => {
    fetchArtists();
    setShowArtistForm(false);
    setEditingArtist(null);
  };

  const handleEditArtist = (artist: Artist) => {
    setEditingArtist(artist);
    setShowArtistForm(true);
  };

  const handleAddTrack = (artist: Artist) => {
    setSelectedArtist(artist);
    setShowTrackForm(true);
  };

  const handleViewDetails = (trackId: string) => {
    setSelectedTrackId(trackId);
    setShowProjectDetails(true);
  };

  const handleTrackSuccess = () => {
    setShowTrackForm(false);
    setSelectedArtist(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <DashboardStats />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Meus Artistas</h2>
          <Button
            onClick={() => setShowArtistForm(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Artista
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-white mt-4">Carregando artistas...</p>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-4">
              Nenhum artista cadastrado ainda
            </p>
            <Button
              onClick={() => setShowArtistForm(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Artista
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onEdit={() => handleEditArtist(artist)}
                onAddTrack={() => handleAddTrack(artist)}
                onViewDetails={() => handleViewDetails(artist.id)}
              />
            ))}
          </div>
        )}

        {showArtistForm && (
          <ArtistForm
            onClose={() => {
              setShowArtistForm(false);
              setEditingArtist(null);
            }}
            onSuccess={handleArtistSuccess}
            editingArtist={editingArtist}
          />
        )}

        {showTrackForm && selectedArtist && (
          <TrackForm
            artistId={selectedArtist.id}
            onClose={() => {
              setShowTrackForm(false);
              setSelectedArtist(null);
            }}
            onSuccess={handleTrackSuccess}
          />
        )}

        {showProjectDetails && selectedTrackId && (
          <ProjectDetails
            trackId={selectedTrackId}
            onClose={() => {
              setShowProjectDetails(false);
              setSelectedTrackId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
