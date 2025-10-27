import type { Song } from "../../type";

interface SongMetadataProps {
  song: Song;
}

export function SongMetadata({ song }: SongMetadataProps) {
  // Build array of metadata items, filtering out empty values
  const metadataItems = [
    `🎵 ${song.bpm} BPM`,
    song.genre || null,
    song.duration || null,
  ].filter(Boolean); // Remove null/undefined/empty values

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      {metadataItems.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {item}
          {/* Only show dot separator if not the last item */}
          {index < metadataItems.length - 1 && <span className="ml-4">•</span>}
        </span>
      ))}
    </div>
  );
}
