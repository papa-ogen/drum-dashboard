export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  // Handle ISO timestamps (e.g., "2025-10-08T16:00:00.000Z")
  const datePart = dateString.split("T")[0]; // Get YYYY-MM-DD part
  const [, month, day] = datePart.split("-");
  return `${month}/${day}`;
};

/**
 * Formats a date to full format (e.g., "October 9, 2025")
 * @param date - Date object or ISO timestamp string
 * @returns Formatted date string
 */
export const formatFullDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a UTC timestamp to time of day (e.g., "4:00 PM")
 * @param timestamp - ISO timestamp string
 * @returns Formatted time in 12-hour format
 */
export const formatTimeOfDay = (timestamp: string): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Convert to 12-hour format
  const isPM = hours >= 12;
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes.toString().padStart(2, "0");

  return `${hour12}:${minuteStr} ${isPM ? "PM" : "AM"}`;
};

/**
 * Formats an hour (0-23) to 12-hour format (e.g., "4 PM", "10 AM")
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Formatted hour in 12-hour format
 */
export const formatHour = (hour: number): string => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
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
 * Gets the UTC hour of day from a session's date timestamp
 * @param session - Session object with ISO timestamp in date field
 * @returns Hour (0-23) in UTC
 */
export const getSessionHour = (session: { date: string }): number => {
  const date = new Date(session.date);
  return date.getUTCHours();
};

/**
 * Gets the time period of day from a session's date timestamp (UTC)
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
