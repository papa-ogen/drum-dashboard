import { useContext, createContext } from "react";
import type { SegmentContextType } from "../contexts/SegmentContext";

export const SegmentContext = createContext<SegmentContextType | undefined>(
  undefined
);

export function useSegmentContext() {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error("useSegmentContext must be used within a SegmentProvider");
  }
  return context;
}
