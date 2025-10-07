export interface IExercise {
  id: string;
  name: string;
}

export interface ISession {
  id: string;
  date: string;
  exercise: string;
  bpm: number;
  time: number;
}
