import { useMemo } from "react";
import { StatCard } from "../StatCard";
import { useSessions } from "../../utils/api";

const TotalPracticeTime = () => {
  const { sessions } = useSessions();
  const totalPracticeTime = useMemo(() => {
    if (!sessions || sessions.length === 0) return "0m 0s";

    const totalSeconds = sessions.reduce((acc, s) => acc + s.time, 0);
    // if under an hour,return minutes and seconds
    if (totalSeconds < 3600) {
      return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
    }

    // return hours, minutes and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes === 0 ? "" : `${minutes}m`} ${
      seconds === 0 ? "" : `${seconds}s`
    }`;
  }, [sessions]);

  if (!sessions) return null;

  return <StatCard title="Total Practice Time" value={totalPracticeTime} />;
};

export default TotalPracticeTime;
