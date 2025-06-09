
import { Button } from "@/components/ui/button";
import { Clock, Trash2, CheckCircle, XCircle } from "lucide-react";
import { formatDuration, getStatusText, getStatusColor } from "@/utils/trackUtils";
import type { Track } from "@/types/track";

interface TrackListProps {
  tracks: Track[];
  onDeleteTrack: (trackId: string, trackTitle: string) => void;
  loading: boolean;
}

const TrackList = ({ tracks, onDeleteTrack, loading }: TrackListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'rejected': return <XCircle className="h-3 w-3 text-red-400" />;
      default: return <Clock className="h-3 w-3 text-yellow-400" />;
    }
  };

  if (tracks.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-white font-medium">Faixas:</h4>
      <div className="max-h-48 overflow-y-auto space-y-2">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium truncate">{track.title}</p>
                {getStatusIcon(track.status)}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {track.genre && <span>{track.genre}</span>}
                {track.duration && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(track.duration)}
                    </div>
                  </>
                )}
                <span>•</span>
                <span className={getStatusColor(track.status)}>
                  {getStatusText(track.status)}
                </span>
              </div>
              {track.isrc_code && (
                <div className="text-xs text-gray-500 mt-1">
                  ISRC: {track.isrc_code}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTrack(track.id, track.title)}
              disabled={loading}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
