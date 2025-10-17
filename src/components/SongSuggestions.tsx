import { useState, useEffect } from "react";
import { useSegmentContext } from "../hooks/useSegmentContext";
import { useSessions, useSongs, API_ENDPOINTS } from "../utils/api";
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

  // Use SWR hook to fetch songs
  const { songs, isLoading, isError } = useSongs(
    highestBpmExercise?.bpm || null,
    10
  );

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

  const handlePlaySong = (song: Song) => {
    if (song.previewUrl) {
      // In a real implementation, you'd play the preview
      console.log("Playing:", song.title, "at", song.previewUrl);
    } else {
      console.log("No preview available for:", song.title);
    }
  };

  const handleAddToPlaylist = (song: Song) => {
    // In a real implementation, you'd add to user's playlist
    console.log("Adding to playlist:", song.title);
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
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-500">
                      {index + 1}.
                    </span>
                    <h3 className="font-medium text-gray-900">{song.title}</h3>
                    <span className="text-gray-400">-</span>
                    <span className="text-gray-600">{song.artist}</span>
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
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                    disabled={!song.previewUrl}
                  >
                    ▶️ Play
                  </button>
                  <button
                    onClick={() => handleAddToPlaylist(song)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    ⭐ Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && songs && songs.length === 0 && !isError && (
        <p className="text-gray-500 text-center py-8">
          No songs found for {highestBpmExercise.bpm} BPM.
        </p>
      )}

      <div className="mt-6 flex gap-2">
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
