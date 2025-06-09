
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Plus, Edit } from "lucide-react";
import { useTracks } from "@/hooks/useTracks";
import TrackList from "@/components/TrackList";
import ArtistStats from "@/components/ArtistStats";
import type { Artist } from "@/types/auth";

interface ArtistCardProps {
  artist: Artist;
  onEdit: () => void;
  onAddTrack: () => void;
  onViewDetails: () => void;
}

const ArtistCard = ({ artist, onEdit, onAddTrack, onViewDetails }: ArtistCardProps) => {
  const { tracks, loading, deleteTrack } = useTracks(artist.id);

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
          <ArtistStats tracks={tracks} />
          <TrackList tracks={tracks} onDeleteTrack={deleteTrack} loading={loading} />
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
