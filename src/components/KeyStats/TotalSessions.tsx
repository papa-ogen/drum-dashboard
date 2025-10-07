import { useExercises, useSessions } from "../../utils/api";
import { StatCard } from "../StatCard";

const TotalSessions = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  if (!sessions || !exercises) return null;

  return (
    <StatCard
      title="Total Sessions"
      value={Math.round(sessions.length / exercises.length).toString()}
    />
  );
};

export default TotalSessions;
