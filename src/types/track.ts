
export interface Track {
  id: string;
  title: string;
  duration: number;
  genre: string;
  artist_id: string;
  status: string;
  isrc_code?: string;
  iswc_code?: string;
}
