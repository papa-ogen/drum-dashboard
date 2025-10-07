export interface ISegment {
  id: string;
  name: string;
  order: number;
  startDate?: string;
  endDate?: string;
}

export interface IExercise {
  id: string;
  name: string;
  segmentId: string;
}

export interface ISession {
  id: string;
  date: string;
  exercise: string;
  bpm: number;
  time: number;
}
