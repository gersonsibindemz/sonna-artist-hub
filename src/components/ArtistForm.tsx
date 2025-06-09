
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Artist } from "@/types/auth";

interface ArtistFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editingArtist?: Artist | null;
}

const ArtistForm = ({ onClose, onSuccess, editingArtist }: ArtistFormProps) => {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [accountType, setAccountType] = useState("artist");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (editingArtist) {
      setName(editingArtist.name);
      setGenre(editingArtist.genre || "");
      setBio(editingArtist.bio || "");
      setImageUrl(editingArtist.image_url || "");
      setAccountType(editingArtist.account_type);
    }
  }, [editingArtist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const url = editingArtist 
        ? `https://kqivlifcqykagpecjawk.supabase.co/rest/v1/artists?id=eq.${editingArtist.id}`
        : 'https://kqivlifcqykagpecjawk.supabase.co/rest/v1/artists';
      
      const method = editingArtist ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxaXZsaWZjcXlrYWdwZWNqYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzA1NjMsImV4cCI6MjA2NDgwNjU2M30.1QEArhhIoKy9bJ-hG6FAw7Fiof-uUZ6GJvlg7hzq3fQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          name,
          genre,
          bio,
          image_url: imageUrl,
          account_type: accountType,
        })
      });

      if (response.ok) {
        toast({
          title: editingArtist ? "Artista atualizado!" : "Artista criado!",
          description: `${name} foi ${editingArtist ? 'atualizado' : 'adicionado'} com sucesso.`,
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar artista');
      }
    } catch (error: any) {
      console.error("Erro ao salvar artista:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar artista",
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
              <CardTitle className="text-white">
                {editingArtist ? 'Editar Artista' : 'Novo Artista'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {editingArtist ? 'Atualize as informações do artista' : 'Adicione um novo artista ao seu catálogo'}
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
              <Label htmlFor="accountType" className="text-white">Tipo de Conta *</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione o tipo de conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artist">Artista</SelectItem>
                  <SelectItem value="label">Label</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome do Artista *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Ex: João Silva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="text-white">Gênero Musical</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Ex: Pop, Rock, Hip-hop"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Biografia</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Conte a história do artista..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-white">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="https://exemplo.com/imagem.jpg"
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
                disabled={loading || !name}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
              >
                {loading ? (editingArtist ? "Atualizando..." : "Criando...") : (editingArtist ? "Atualizar" : "Criar Artista")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistForm;
