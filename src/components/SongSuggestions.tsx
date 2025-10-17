import { useState, useEffect, useRef } from "react";
import { useSegmentContext } from "../hooks/useSegmentContext";
import {
  useSessions,
  useSongs,
  API_ENDPOINTS,
  addFavorite,
  useFavorites,
} from "../utils/api";
import { mutate } from "swr";
import type { Song } from "../type";

interface SongSuggestionsProps {
  className?: string;
}

export function SongSuggestions({ className = "" }: SongSuggestionsProps) {
  const { selectedSegment } = useSegmentContext();
  const { sessions } = useSessions();
  const [highestBpmExercise, setHighestBpmExercise] = useState<{
    exerciseId: string;
    exerciseName: string;
    bpm: number;
  } | null>(null);

  // Audio playback state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use SWR hook to fetch songs
  const { songs, isLoading, isError } = useSongs(
    highestBpmExercise?.bpm || null,
    10
  );
  const { favorites } = useFavorites();

  // Find the highest BPM exercise for the current segment
  useEffect(() => {
    if (!selectedSegment || !sessions) return;

    // Filter sessions for exercises in the current segment
    const segmentSessions = sessions.filter((session) => {
      // We need to find exercises that belong to this segment
      // For now, we'll use a simple approach and assume exercise IDs map to segments
      return session.exercise; // We'll need to cross-reference with exercises data
    });

    if (segmentSessions.length === 0) {
      setHighestBpmExercise(null);
      return;
    }

    // Find the session with highest BPM
    const highestBpmSession = segmentSessions.reduce((highest, current) => {
      return current.bpm > highest.bpm ? current : highest;
    });

    // For now, we'll use a mock exercise name since we don't have exercise data loaded
    // In a real implementation, you'd cross-reference with exercises data
    setHighestBpmExercise({
      exerciseId: highestBpmSession.exercise,
      exerciseName: `Exercise ${highestBpmSession.exercise.slice(0, 8)}`, // Mock name
      bpm: highestBpmSession.bpm,
    });
  }, [selectedSegment, sessions]);

  // Clean up audio when component unmounts
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
      console.log("No preview available for:", song.title);
      return;
    }

    // If the same song is already playing, pause it
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
      console.log("Loading preview for:", song.title);
    });

    audio.addEventListener("canplay", () => {
      console.log("Ready to play:", song.title);
    });

    audio.addEventListener("play", () => {
      setIsPlaying(true);
      setCurrentlyPlaying(song.id);
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("ended", () => {
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

  const [addingId, setAddingId] = useState<string | null>(null);
  const handleAddToPlaylist = async (song: Song) => {
    try {
      setAddingId(song.id);
      const payload: Partial<Song> & {
        spotifyId?: string;
        preview_url?: string;
        album?: string;
        albumArt?: string;
        popularity?: number;
      } = {
        title: song.title,
        artist: song.artist,
        bpm: song.bpm,
        spotifyId: song.spotifyId ?? song.id,
        preview_url: song.preview_url ?? song.previewUrl,
        spotifyUrl: song.spotifyUrl,
        albumArt: song.albumArt,
        album: song.album,
        popularity: song.popularity,
      };
      await addFavorite(payload as Partial<Song>);
    } catch (e) {
      console.error("Failed to add favorite", e);
    } finally {
      setAddingId(null);
    }
  };

  if (!selectedSegment) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🎵 Song Suggestions
        </h2>
        <p className="text-gray-500">
          Please select a segment to see song suggestions.
        </p>
      </div>
    );
  }

  if (!highestBpmExercise) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🎵 Song Suggestions
        </h2>
        <p className="text-gray-500">No exercises found for this segment.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🎵 Song Suggestions
      </h2>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          Based on your highest BPM exercise in{" "}
          <strong>"{selectedSegment.name}"</strong>:
        </p>
        <p className="text-sm font-medium text-blue-900 mt-1">
          🥁 "{highestBpmExercise.exerciseName}" at {highestBpmExercise.bpm} BPM
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading songs...</span>
        </div>
      )}

      {isError && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Failed to fetch songs: {isError.message}
          </p>
        </div>
      )}

      {!isLoading && songs && songs.length > 0 && (
        <div className="space-y-3">
          {(() => {
            const favoriteKeys = new Set(
              (favorites || []).map(
                (f) => f.spotifyId || f.id || `${f.title}::${f.artist}`
              )
            );
            const nonFavoriteSongs = songs.filter((s) => {
              const key = s.spotifyId || s.id || `${s.title}::${s.artist}`;
              return !favoriteKeys.has(key);
            });
            const ordered = [...(favorites || []), ...nonFavoriteSongs];
            return ordered.map((song, index) => (
              <div
                key={song.id}
                className={`p-4 border rounded-lg transition-colors ${
                  currentlyPlaying === song.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">
                        {index + 1}.
                      </span>
                      <h3 className="font-medium text-gray-900">
                        {song.title}
                      </h3>
                      <span className="text-gray-400">-</span>
                      <span className="text-gray-600">{song.artist}</span>
                      {favoriteKeys.has(
                        song.spotifyId ||
                          song.id ||
                          `${song.title}::${song.artist}`
                      ) && (
                        <span className="text-yellow-600 text-sm">
                          ⭐ Favorite
                        </span>
                      )}
                      {currentlyPlaying === song.id && (
                        <span className="text-blue-600 text-sm">
                          🔊 Playing
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        🎵 {song.bpm} BPM
                      </span>
                      <span>•</span>
                      <span>{song.genre}</span>
                      <span>•</span>
                      <span>{song.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handlePlaySong(song)}
                      className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
                        currentlyPlaying === song.id && isPlaying
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : song.previewUrl
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!song.previewUrl}
                    >
                      {currentlyPlaying === song.id && isPlaying ? (
                        <>⏸️ Pause</>
                      ) : (
                        <>▶️ Play</>
                      )}
                    </button>
                    <button
                      onClick={() => handleAddToPlaylist(song)}
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
            ));
          })()}
        </div>
      )}

      {!isLoading && songs && songs.length === 0 && !isError && (
        <p className="text-gray-500 text-center py-8">
          No songs found for {highestBpmExercise.bpm} BPM.
        </p>
      )}

      <div className="mt-6 flex gap-2">
        {currentlyPlaying && (
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
                setCurrentlyPlaying(null);
              }
            }}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            ⏹️ Stop All
          </button>
        )}
        <button
          onClick={() => {
            if (highestBpmExercise) {
              // Trigger SWR revalidation
              mutate(
                `${API_ENDPOINTS.SONGS}?bpm=${highestBpmExercise.bpm}&limit=10`
              );
            }
          }}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          🔄 Refresh Suggestions
        </button>
        <button
          onClick={() => {
            // In a real implementation, you'd allow user to input different BPM
            console.log("Different BPM requested");
          }}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          🎯 Different BPM
        </button>
      </div>
    </div>
  );
}
