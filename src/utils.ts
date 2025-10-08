export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [, month, day] = dateString.split("-");
  return `${month}/${day}`;
};

/**
 * Counts the number of unique days that have at least one session
 * @param sessions - Array of session objects with date property
 * @param startDate - Optional start date to filter from
 * @param endDate - Optional end date to filter to
 * @returns Number of unique days with sessions
 */
export const countUniquePracticeDays = (
  sessions: Array<{ date: string }>,
  startDate?: Date,
  endDate?: Date
): number => {
  if (!sessions || sessions.length === 0) return 0;

  const uniqueDates = new Set(
    sessions
      .filter((session) => {
        if (!startDate && !endDate) return true;
        const sessionDate = new Date(session.date);
        const afterStart = !startDate || sessionDate >= startDate;
        const beforeEnd = !endDate || sessionDate <= endDate;
        return afterStart && beforeEnd;
      })
      .map((session) => session.date)
  );

  return uniqueDates.size;
};

/**
 * Gets the hour of day from a session's timestamp
 * @param session - Session object with optional timestamp
 * @returns Hour (0-23) or null if no timestamp
 */
export const getSessionHour = (session: {
  timestamp?: string;
  date: string;
}): number | null => {
  if (!session.timestamp) return null;
  const date = new Date(session.timestamp);
  return date.getHours();
};

/**
 * Gets the time period of day from a session's timestamp
 * @param session - Session object with optional timestamp
 * @returns "Morning" (5-12), "Afternoon" (12-17), "Evening" (17-21), "Night" (21-5), or null
 */
export const getSessionTimePeriod = (session: {
  timestamp?: string;
  date: string;
}): "Morning" | "Afternoon" | "Evening" | "Night" | null => {
  const hour = getSessionHour(session);
  if (hour === null) return null;

  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};
