import { useState, useRef, useEffect } from "react";
import { SongCard } from "./SongCard";
import type { Song } from "../type";

interface SongListProps {
  songs: Song[];
  favorites: Song[];
  onAddToFavorites: (song: Song) => Promise<void>;
}

export function SongList({
  songs,
  favorites,
  onAddToFavorites,
}: SongListProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlaySong = (song: Song) => {
    if (!song.previewUrl) {
      console.log("No preview URL available for this song");
      return;
    }

    // If clicking the same song that's playing, pause it
    if (currentlyPlaying === song.id && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create new audio element
    const audio = new Audio(song.previewUrl);
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener("loadstart", () => {
      console.log("Loading audio preview...");
    });

    audio.addEventListener("canplay", () => {
      console.log("Audio ready to play");
    });

    audio.addEventListener("play", () => {
      console.log("Audio started playing");
      setIsPlaying(true);
      setCurrentlyPlaying(song.id);
    });

    audio.addEventListener("pause", () => {
      console.log("Audio paused");
      setIsPlaying(false);
    });

    audio.addEventListener("ended", () => {
      console.log("Audio finished playing");
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      audioRef.current = null;
    });

    audio.addEventListener("error", (e) => {
      console.error("Error playing preview:", e);
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      audioRef.current = null;
    });

    // Start playing
    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    });
  };

  const handleAddToFavorites = async (song: Song) => {
    try {
      setAddingId(song.id);
      await onAddToFavorites(song);
    } catch (e) {
      console.error("Failed to add favorite", e);
    } finally {
      setAddingId(null);
    }
  };

  const handleStopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    }
  };

  // Merge favorites on top, dedupe by spotifyId/id or title+artist
  const favoriteKeys = new Set(
    favorites.map((f) => f.spotifyId || f.id || `${f.title}::${f.artist}`)
  );

  const nonFavoriteSongs = songs.filter((s) => {
    const key = s.spotifyId || s.id || `${s.title}::${s.artist}`;
    return !favoriteKeys.has(key);
  });

  const orderedSongs = [...favorites, ...nonFavoriteSongs];

  return (
    <>
      <div className="space-y-3">
        {orderedSongs.map((song, index) => {
          // Create a unique key using multiple identifiers to avoid duplicates
          const uniqueKey = song.spotifyId
            ? `${song.spotifyId}-${index}`
            : song.id
            ? `${song.id}-${index}`
            : `${song.title}-${song.artist}-${index}`;

          return (
            <SongCard
              key={uniqueKey}
              song={song}
              index={index}
              currentlyPlaying={currentlyPlaying}
              isPlaying={isPlaying}
              addingId={addingId}
              isFavorite={favoriteKeys.has(
                song.spotifyId || song.id || `${song.title}::${song.artist}`
              )}
              onPlay={handlePlaySong}
              onAddToFavorites={handleAddToFavorites}
            />
          );
        })}
      </div>

      <div className="mt-6 flex gap-2">
        {currentlyPlaying && (
          <button
            onClick={handleStopAll}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            ⏹️ Stop All
          </button>
        )}
      </div>
    </>
  );
}
