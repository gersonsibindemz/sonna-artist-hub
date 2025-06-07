
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrackFormProps {
  artistId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TrackForm = ({ artistId, onClose, onSuccess }: TrackFormProps) => {
  // Campos obrigatórios
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Campos opcionais
  const [album, setAlbum] = useState("");
  const [trackNumber, setTrackNumber] = useState<number | "">("");
  const [trackType, setTrackType] = useState("single");
  const [recordingDate, setRecordingDate] = useState("");
  const [composer, setComposer] = useState("");
  const [lyricist, setLyricist] = useState("");
  const [publisher, setPublisher] = useState("");
  const [copyrightHolder, setCopyrightHolder] = useState("");
  const [proSociety, setProSociety] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [language, setLanguage] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [additionalCredits, setAdditionalCredits] = useState("");
  const [coverArtUrl, setCoverArtUrl] = useState("");
  const [albumNotes, setAlbumNotes] = useState("");
  const [upcEanCode, setUpcEanCode] = useState("");
  const [recordLabel, setRecordLabel] = useState("");
  const [releaseCountry, setReleaseCountry] = useState("");
  const [tags, setTags] = useState("");
  const [extraComments, setExtraComments] = useState("");
  
  // Campos automáticos (simulados para demo)
  const [duration, setDuration] = useState<number | "">("");
  const [bitRate, setBitRate] = useState<number | "">("");
  const [sampleRate, setSampleRate] = useState<number | "">("");
  const [channels, setChannels] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trackData = {
        artist_id: artistId,
        title,
        genre,
        year,
        album: album || null,
        track_number: trackNumber || null,
        duration: duration || null,
        track_type: trackType,
        file_format: "WAV",
        bit_rate: bitRate || null,
        sample_rate: sampleRate || null,
        channels: channels || null,
        recording_date: recordingDate || null,
        composer: composer || null,
        lyricist: lyricist || null,
        publisher: publisher || null,
        copyright_holder: copyrightHolder || null,
        pro_society: proSociety || null,
        license_type: licenseType || null,
        language: language || null,
        lyrics: lyrics || null,
        additional_credits: additionalCredits || null,
        cover_art_url: coverArtUrl || null,
        album_notes: albumNotes || null,
        upc_ean_code: upcEanCode || null,
        record_label: recordLabel || null,
        release_country: releaseCountry || null,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : null,
        extra_comments: extraComments || null,
        status: 'pending'
      };

      const { data: track, error } = await supabase
        .from("tracks")
        .insert(trackData)
        .select()
        .single();

      if (error) throw error;

      // Validar duplicatas
      try {
        const response = await fetch('/functions/v1/validateDuplicate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            trackId: track.id,
            title,
            artist: artistId,
            isrcCode: track.isrc_code,
            iswcCode: track.iswc_code
          })
        });

        if (response.ok) {
          const duplicateResult = await response.json();
          if (duplicateResult.duplicatesFound > 0) {
            setDuplicateWarning(true);
            toast({
              title: "Possível duplicata detectada",
              description: `Encontradas ${duplicateResult.duplicatesFound} possíveis duplicatas. Os analistas serão notificados.`,
              variant: "destructive",
            });
          }
        }
      } catch (duplicateError) {
        console.error('Erro na validação de duplicata:', duplicateError);
      }

      toast({
        title: "Faixa cadastrada com sucesso!",
        description: `"${title}" foi enviada para aprovação. Códigos ISRC e ISWC foram gerados automaticamente.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar faixa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const OptionalFieldNote = () => (
    <span className="text-xs text-gray-500 block mt-1">
      Pode deixar em branco se não tiver esta informação
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-white/20 my-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Nova Faixa Musical</CardTitle>
              <CardDescription className="text-gray-300">
                Adicione uma nova faixa com metadados completos
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
          {duplicateWarning && (
            <div className="flex items-center gap-2 p-3 bg-orange-500/20 border border-orange-500/50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              <span className="text-orange-200 text-sm">
                Possível duplicata detectada. A faixa será analisada pelos especialistas.
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Informações Básicas *
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Título da Música *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Nome da música"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-white">Gênero *</Label>
                  <Input
                    id="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Ex: Pop, Rock, Hip-hop"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-white">Ano de Lançamento *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trackType" className="text-white">Tipo da Faixa *</Label>
                  <Select value={trackType} onValueChange={setTrackType}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="acoustic">Acoustic</SelectItem>
                      <SelectItem value="instrumental">Instrumental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Informações do Álbum */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Informações do Álbum
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="album" className="text-white">Nome do Álbum</Label>
                  <Input
                    id="album"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Nome do álbum ou EP"
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trackNumber" className="text-white">Número da Faixa</Label>
                  <Input
                    id="trackNumber"
                    type="number"
                    value={trackNumber}
                    onChange={(e) => setTrackNumber(e.target.value ? parseInt(e.target.value) : "")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Posição no álbum"
                    min="1"
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="albumNotes" className="text-white">Notas do Álbum</Label>
                  <Textarea
                    id="albumNotes"
                    value={albumNotes}
                    onChange={(e) => setAlbumNotes(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Informações adicionais sobre o álbum"
                    rows={2}
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverArtUrl" className="text-white">Arte da Capa</Label>
                  <Input
                    id="coverArtUrl"
                    value={coverArtUrl}
                    onChange={(e) => setCoverArtUrl(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="URL da imagem da capa"
                  />
                  <OptionalFieldNote />
                </div>
              </div>
            </div>

            {/* Informações Técnicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Informações Técnicas
                <Badge variant="secondary" className="ml-2">Alguns campos são automáticos</Badge>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-white">Duração (segundos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : "")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Automático ao fazer upload"
                  />
                  <span className="text-xs text-blue-400">Preenchido automaticamente</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bitRate" className="text-white">Taxa de Bits (kbps)</Label>
                  <Input
                    id="bitRate"
                    type="number"
                    value={bitRate}
                    onChange={(e) => setBitRate(e.target.value ? parseInt(e.target.value) : "")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Automático ao fazer upload"
                  />
                  <span className="text-xs text-blue-400">Preenchido automaticamente</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sampleRate" className="text-white">Frequência de Amostragem (Hz)</Label>
                  <Input
                    id="sampleRate"
                    type="number"
                    value={sampleRate}
                    onChange={(e) => setSampleRate(e.target.value ? parseInt(e.target.value) : "")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Automático ao fazer upload"
                  />
                  <span className="text-xs text-blue-400">Preenchido automaticamente</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channels" className="text-white">Canal</Label>
                  <Select value={channels} onValueChange={setChannels}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Automático ao fazer upload" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mono">Mono</SelectItem>
                      <SelectItem value="stereo">Stereo</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-blue-400">Preenchido automaticamente</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Formato do Arquivo</Label>
                  <Input
                    value="WAV"
                    disabled
                    className="bg-white/5 border-white/20 text-gray-400"
                  />
                  <span className="text-xs text-gray-500">Apenas WAV é aceito</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recordingDate" className="text-white">Data da Gravação</Label>
                  <Input
                    id="recordingDate"
                    type="date"
                    value={recordingDate}
                    onChange={(e) => setRecordingDate(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <OptionalFieldNote />
                </div>
              </div>
            </div>

            {/* Créditos e Direitos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Créditos e Direitos Autorais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="composer" className="text-white">Compositor</Label>
                  <Input
                    id="composer"
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Nome do compositor"
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lyricist" className="text-white">Autor da Letra</Label>
                  <Input
                    id="lyricist"
                    value={lyricist}
                    onChange={(e) => setLyricist(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Nome do letrista"
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publisher" className="text-white">Editor</Label>
                  <Input
                    id="publisher"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Editora musical"
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copyrightHolder" className="text-white">Detentor dos Direitos</Label>
                  <Input
                    id="copyrightHolder"
                    value={copyrightHolder}
                    onChange={(e) => setCopyrightHolder(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Quem detém os direitos autorais"
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proSociety" className="text-white">Sociedade de Gestão (PRO)</Label>
                  <Input
                    id="proSociety"
                    value={proSociety}
                    onChange={(e) => setProSociety(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Ex: SPA, SACEM, etc."
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseType" className="text-white">Licença de Uso</Label>
                  <Input
                    id="licenseType"
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Tipo de licença"
                  />
                  <OptionalFieldNote />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalCredits" className="text-white">Créditos Adicionais</Label>
                <Textarea
                  id="additionalCredits"
                  value={additionalCredits}
                  onChange={(e) => setAdditionalCredits(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Produtor, arranjador, instrumentistas, etc."
                  rows={3}
                />
                <OptionalFieldNote />
              </div>
            </div>

            {/* Informações de Lançamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Informações de Lançamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recordLabel" className="text-white">Gravadora (Label)</Label>
                  <Input
                    id="recordLabel"
                    value={recordLabel}
                    onChange={(e) => setRecordLabel(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Nome da gravadora"
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="releaseCountry" className="text-white">País de Lançamento</Label>
                  <Input
                    id="releaseCountry"
                    value={releaseCountry}
                    onChange={(e) => setReleaseCountry(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Ex: Brasil, Portugal, etc."
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-white">Idioma da Música</Label>
                  <Input
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Ex: Português, Inglês, etc."
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upcEanCode" className="text-white">Código UPC/EAN</Label>
                  <Input
                    id="upcEanCode"
                    value={upcEanCode}
                    onChange={(e) => setUpcEanCode(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Código de barras do produto"
                  />
                  <OptionalFieldNote />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-white">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="dance, pop, romântica (separadas por vírgula)"
                />
                <OptionalFieldNote />
              </div>
            </div>

            {/* Conteúdo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Conteúdo
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lyrics" className="text-white">Letra da Música</Label>
                  <Textarea
                    id="lyrics"
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Letra completa da música..."
                    rows={6}
                  />
                  <OptionalFieldNote />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extraComments" className="text-white">Comentários Extras</Label>
                  <Textarea
                    id="extraComments"
                    value={extraComments}
                    onChange={(e) => setExtraComments(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Informações adicionais sobre a música..."
                    rows={3}
                  />
                  <OptionalFieldNote />
                </div>
              </div>
            </div>

            {/* Códigos Automáticos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Códigos de Identificação
                <Badge variant="secondary" className="ml-2">Gerados automaticamente</Badge>
              </h3>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>ISRC e ISWC:</strong> Estes códigos serão gerados automaticamente pelo sistema após o cadastro da faixa, seguindo os padrões internacionais.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-6 border-t border-white/20">
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
                disabled={loading || !title || !genre}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold"
              >
                {loading ? "Cadastrando..." : "Cadastrar Faixa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackForm;
