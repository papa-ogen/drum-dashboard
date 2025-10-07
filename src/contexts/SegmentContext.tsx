import { useState, useEffect, type ReactNode } from "react";
import type { ISegment } from "../type";
import { useSegments } from "../utils/api";
import { getCurrentSegment } from "../utils/segments";
import { SegmentContext } from "../hooks/useSegmentContext";

export interface SegmentContextType {
  selectedSegment: ISegment | null;
  setSelectedSegment: (segment: ISegment | null) => void;
  allSegments: ISegment[] | undefined;
  isLoading: boolean;
}

export function SegmentProvider({ children }: { children: ReactNode }) {
  const { segments, isLoading } = useSegments();
  const [selectedSegment, setSelectedSegment] = useState<ISegment | null>(null);

  // Auto-select current segment on initial load
  useEffect(() => {
    if (segments && !selectedSegment) {
      const current = getCurrentSegment(segments);
      if (current) {
        setSelectedSegment(current);
      } else if (segments.length > 0) {
        // If no current segment, select the first one
        setSelectedSegment(segments[0]);
      }
    }
  }, [segments, selectedSegment]);

  return (
    <SegmentContext.Provider
      value={{
        selectedSegment,
        setSelectedSegment,
        allSegments: segments,
        isLoading,
      }}
    >
      {children}
    </SegmentContext.Provider>
  );
}
