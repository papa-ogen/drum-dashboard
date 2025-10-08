export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  // Handle ISO timestamps (e.g., "2025-10-08T16:00:00.000Z")
  const datePart = dateString.split("T")[0]; // Get YYYY-MM-DD part
  const [, month, day] = datePart.split("-");
  return `${month}/${day}`;
};

/**
 * Counts the number of unique days that have at least one session
 * @param sessions - Array of session objects with date property (ISO timestamp)
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
      .map((session) => session.date.split("T")[0]) // Extract just the date part
  );

  return uniqueDates.size;
};

/**
 * Gets the hour of day from a session's date timestamp
 * @param session - Session object with ISO timestamp in date field
 * @returns Hour (0-23)
 */
export const getSessionHour = (session: { date: string }): number => {
  const date = new Date(session.date);
  return date.getHours();
};

/**
 * Gets the time period of day from a session's date timestamp
 * @param session - Session object with ISO timestamp in date field
 * @returns "Morning" (5-12), "Afternoon" (12-17), "Evening" (17-21), "Night" (21-5)
 */
export const getSessionTimePeriod = (session: {
  date: string;
}): "Morning" | "Afternoon" | "Evening" | "Night" => {
  const hour = getSessionHour(session);

  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};
