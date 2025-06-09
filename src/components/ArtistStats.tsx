
import type { Track } from "@/types/track";

interface ArtistStatsProps {
  tracks: Track[];
}

const ArtistStats = ({ tracks }: ArtistStatsProps) => {
  const pendingTracks = tracks.filter(t => t.status === 'pending');
  const approvedTracks = tracks.filter(t => t.status === 'approved');

  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="bg-white/5 rounded-lg p-2">
        <div className="text-lg font-bold text-white">{tracks.length}</div>
        <div className="text-xs text-gray-400">Total</div>
      </div>
      <div className="bg-white/5 rounded-lg p-2">
        <div className="text-lg font-bold text-green-400">{approvedTracks.length}</div>
        <div className="text-xs text-gray-400">Aprovadas</div>
      </div>
      <div className="bg-white/5 rounded-lg p-2">
        <div className="text-lg font-bold text-yellow-400">{pendingTracks.length}</div>
        <div className="text-xs text-gray-400">Pendentes</div>
      </div>
    </div>
  );
};

export default ArtistStats;
