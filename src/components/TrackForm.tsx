
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrackFormProps {
  artistId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TrackForm = ({ artistId, onClose, onSuccess }: TrackFormProps) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [coverArtUrl, setCoverArtUrl] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("tracks")
        .insert({
          artist_id: artistId,
          title,
          duration: duration ? parseInt(duration) : null,
          genre,
          file_url: fileUrl,
          cover_art_url: coverArtUrl,
          release_date: releaseDate || null,
        });

      if (error) throw error;

      toast({
        title: "Faixa criada com sucesso!",
        description: `"${title}" foi adicionada ao artista.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao criar faixa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Nova Faixa</CardTitle>
              <CardDescription className="text-gray-300">
                Adicione uma nova música ao artista
              </CardDescription>
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Título da Música *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Ex: Minha Canção"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duração (segundos)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Ex: 240"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="text-white">Gênero</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Ex: Pop, Rock, Hip-hop"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl" className="text-white">URL do Arquivo</Label>
              <Input
                id="fileUrl"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="https://exemplo.com/musica.mp3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverArt" className="text-white">Capa do Álbum</Label>
              <Input
                id="coverArt"
                value={coverArtUrl}
                onChange={(e) => setCoverArtUrl(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="https://exemplo.com/capa.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate" className="text-white">Data de Lançamento</Label>
              <Input
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !title}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
              >
                {loading ? "Criando..." : "Adicionar Faixa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackForm;
