import type { IExercise, ISegment } from "../type";

/**
 * Get exercises grouped by segment
 */
export function getExercisesBySegment(
  exercises: IExercise[] | undefined,
  segments: ISegment[] | undefined
): Map<ISegment, IExercise[]> {
  const grouped = new Map<ISegment, IExercise[]>();

  if (!exercises || !segments) return grouped;

  // Sort segments by order
  const sortedSegments = [...segments].sort((a, b) => a.order - b.order);

  sortedSegments.forEach((segment) => {
    const segmentExercises = exercises.filter(
      (ex) => ex.type === "segment" && ex.segmentId === segment.id
    );
    if (segmentExercises.length > 0) {
      grouped.set(segment, segmentExercises);
    }
  });

  return grouped;
}

/**
 * Get exercises for a specific segment
 */
export function getExercisesForSegment(
  exercises: IExercise[] | undefined,
  segmentId: string
): IExercise[] {
  if (!exercises) return [];
  return exercises.filter(
    (ex) => ex.type === "segment" && ex.segmentId === segmentId
  );
}

/**
 * Get the segment for a given exercise
 */
export function getSegmentForExercise(
  exercise: IExercise | undefined,
  segments: ISegment[] | undefined
): ISegment | undefined {
  if (!exercise || !segments) return undefined;
  return segments.find((seg) => seg.id === exercise.segmentId);
}

/**
 * Get the current active segment based on today's date
 */
export function getCurrentSegment(
  segments: ISegment[] | undefined
): ISegment | undefined {
  if (!segments) return undefined;

  const today = new Date();
  return segments.find((segment) => {
    if (!segment.startDate || !segment.endDate) return false;

    const start = new Date(segment.startDate);
    const end = new Date(segment.endDate);

    return today >= start && today <= end;
  });
}
