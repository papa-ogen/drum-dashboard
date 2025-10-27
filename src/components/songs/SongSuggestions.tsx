import { useState, useEffect } from "react";
import {
  useSessions,
  useSongs,
  API_ENDPOINTS,
  addFavorite,
  useFavorites,
  useExercises,
} from "../../utils/api";
import { mutate } from "swr";
import { SongList } from "./SongList";
import type { Song } from "../../type";
import { useSegmentContext } from "../../hooks/useSegmentContext";

interface SongSuggestionsProps {
  className?: string;
}

export function SongSuggestions({ className = "" }: SongSuggestionsProps) {
  const { selectedSegment } = useSegmentContext();
  const { sessions } = useSessions();
  const { exercises } = useExercises();
  const [highestBpmExercise, setHighestBpmExercise] = useState<{
    exerciseId: string;
    exerciseName: string;
    bpm: number;
  } | null>(null);

  // Use SWR hook to fetch songs
  const { songs, isLoading, isError } = useSongs(
    highestBpmExercise?.bpm || null,
    10
  );
  const { favorites } = useFavorites();

  // Find the highest BPM exercise for the current segment
  useEffect(() => {
    if (!selectedSegment || !sessions || !exercises) return;

    // For now, just use all sessions since ISession doesn't have segmentId
    // In a real app, you'd filter by segment or add segmentId to ISession
    if (sessions.length === 0) {
      setHighestBpmExercise(null);
      return;
    }

    // Find the highest BPM among all sessions
    const highestBpmSession = sessions.reduce((highest, current) => {
      return current.bpm > highest.bpm ? current : highest;
    });

    // Find the exercise name by ID
    const exercise = exercises.find((e) => e.id === highestBpmSession.exercise);
    const exerciseName = exercise?.name || "Unknown Exercise";

    setHighestBpmExercise({
      exerciseId: highestBpmSession.exercise,
      exerciseName: exerciseName,
      bpm: highestBpmSession.bpm,
    });
  }, [selectedSegment, sessions, exercises]);

  const handleAddToFavorites = async (song: Song) => {
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
  };

  const handleRefreshSuggestions = () => {
    if (highestBpmExercise) {
      // Trigger SWR revalidation
      mutate(`${API_ENDPOINTS.SONGS}?bpm=${highestBpmExercise.bpm}&limit=10`);
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          🎵 Song Suggestions
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefreshSuggestions}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => {
              // In a real implementation, you'd allow user to input different BPM
              console.log("Different BPM requested");
            }}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            🎯 Different BPM
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Segment:</strong> {selectedSegment.name}
        </p>
        <p className="text-sm text-blue-800">
          <strong>Highest BPM Exercise:</strong>{" "}
          {highestBpmExercise.exerciseName} ({highestBpmExercise.bpm} BPM)
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
        <SongList
          songs={songs}
          favorites={favorites || []}
          onAddToFavorites={handleAddToFavorites}
        />
      )}

      {!isLoading && songs && songs.length === 0 && !isError && (
        <p className="text-gray-500 text-center py-8">
          No songs found for {highestBpmExercise.bpm} BPM.
        </p>
      )}
    </div>
  );
}
