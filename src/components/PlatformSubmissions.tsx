
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";

interface PlatformSubmission {
  id: string;
  status: string;
  streaming_url: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  streaming_platforms: {
    name: string;
    logo_url: string;
    base_url: string;
  };
}

interface PlatformSubmissionsProps {
  trackId: string;
  trackTitle: string;
}

const PlatformSubmissions = ({ trackId, trackTitle }: PlatformSubmissionsProps) => {
  const [submissions, setSubmissions] = useState<PlatformSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [trackId]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("platform_submissions")
        .select(`
          *,
          streaming_platforms (
            name,
            logo_url,
            base_url
          )
        `)
        .eq("track_id", trackId)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Erro ao carregar submissões:", error);
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

  if (loading) {
    return <div className="animate-pulse h-32 bg-white/10 rounded-lg"></div>;
  }

  if (submissions.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <p className="text-gray-400 text-center">
            Nenhuma submissão encontrada para esta faixa.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white mb-4">
        Plataformas de Streaming - {trackTitle}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="bg-white/10 border-white/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={submission.streaming_platforms.logo_url}
                  alt={submission.streaming_platforms.name}
                  className="w-8 h-8 object-contain"
                />
                <div className="flex-1">
                  <CardTitle className="text-white text-sm">
                    {submission.streaming_platforms.name}
                  </CardTitle>
                  <Badge className={`${getStatusColor(submission.status)} text-xs`}>
                    {getStatusIcon(submission.status)}
                    <span className="ml-1">{getStatusText(submission.status)}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-xs text-gray-400">
                  Submetido: {new Date(submission.submitted_at).toLocaleDateString('pt-BR')}
                </p>
                {submission.reviewed_at && (
                  <p className="text-xs text-gray-400">
                    Revisado: {new Date(submission.reviewed_at).toLocaleDateString('pt-BR')}
                  </p>
                )}
                {submission.status === 'approved' && submission.streaming_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent border-green-500/50 text-green-400 hover:bg-green-500/10"
                    onClick={() => window.open(submission.streaming_url!, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ouvir na Plataforma
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlatformSubmissions;
