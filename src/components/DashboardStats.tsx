
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Upload, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStatsProps {}

const DashboardStats = ({}: DashboardStatsProps) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalTracks: 0,
    pendingTracks: 0,
    approvedTracks: 0
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Buscar artistas do usuário
      const { data: artists, error: artistsError } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user!.id);

      if (artistsError) throw artistsError;

      const artistIds = artists?.map(a => a.id) || [];

      // Buscar faixas dos artistas
      const { data: tracks, error: tracksError } = await supabase
        .from('tracks')
        .select('status')
        .in('artist_id', artistIds);

      if (tracksError) throw tracksError;

      const totalTracks = tracks?.length || 0;
      const pendingTracks = tracks?.filter(t => t.status === 'pending').length || 0;
      const approvedTracks = tracks?.filter(t => t.status === 'approved').length || 0;

      setStats({
        totalArtists: artists?.length || 0,
        totalTracks,
        pendingTracks,
        approvedTracks
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const statCards = [
    {
      title: "Artistas",
      value: stats.totalArtists,
      description: "Artistas cadastrados",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Faixas",
      value: stats.totalTracks,
      description: "Total de faixas",
      icon: Music,
      color: "text-green-400"
    },
    {
      title: "Pendentes",
      value: stats.pendingTracks,
      description: "Aguardando aprovação",
      icon: Upload,
      color: "text-yellow-400"
    },
    {
      title: "Aprovadas",
      value: stats.approvedTracks,
      description: "Prontas para distribuição",
      icon: TrendingUp,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <Card key={stat.title} className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stat.value}
            </div>
            <p className="text-xs text-gray-400">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
