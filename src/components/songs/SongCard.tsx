import type { Song } from "../../type";
import { SongMetadata } from "./SongMetadata";

interface SongCardProps {
  song: Song;
  index: number;
  currentlyPlaying: string | null;
  isPlaying: boolean;
  addingId: string | null;
  isFavorite: boolean;
  onPlay: (song: Song) => void;
  onAddToFavorites: (song: Song) => void;
}

export function SongCard({
  song,
  index,
  currentlyPlaying,
  isPlaying,
  addingId,
  isFavorite,
  onPlay,
  onAddToFavorites,
}: SongCardProps) {
  const isCurrentlyPlaying = currentlyPlaying === song.id;

  return (
    <div
      className={`p-4 border rounded-lg transition-colors ${
        isCurrentlyPlaying
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between flex-col sm:flex-row">
        <div className="flex-1 gap-2 mb-2 sm:mb-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-500">
              {index + 1}.
            </span>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                {song.title}
              </h3>
              <span className="text-gray-400">-</span>
              <span className="text-gray-600 truncate max-w-[120px] sm:max-w-none">
                {song.artist}
              </span>
            </div>
            {isFavorite && (
              <span className="text-yellow-600 text-sm">⭐ Favorite</span>
            )}
            {isCurrentlyPlaying && (
              <span className="text-blue-600 text-sm">🔊 Playing</span>
            )}
          </div>
          <SongMetadata song={song} />
        </div>
        <div className="flex items-center gap-2 sm:ml-4">
          <button
            onClick={() => onPlay(song)}
            className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
              isCurrentlyPlaying && isPlaying
                ? "bg-red-600 text-white hover:bg-red-700"
                : song.previewUrl
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!song.previewUrl}
          >
            {isCurrentlyPlaying && isPlaying ? <>⏸️ Pause</> : <>▶️ Play</>}
          </button>
          <button
            onClick={() => onAddToFavorites(song)}
            className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
              addingId === song.id
                ? "bg-gray-300 text-gray-500 cursor-wait"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            disabled={addingId === song.id}
          >
            {addingId === song.id ? "Adding..." : "⭐ Add"}
          </button>
          {song.spotifyUrl && (
            <a
              href={song.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              🎵 Spotify
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
