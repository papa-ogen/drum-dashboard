import { useMemo } from "react";
import { useExercises, useSessions, useSegments } from "../../utils/api";

const PracticeHeatmap = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();
  const { segments } = useSegments();

  const heatmapData = useMemo(() => {
    if (!sessions || !exercises || !segments) return [];

    // Get date range from first segment start to today
    const firstSegment = [...segments].sort((a, b) => a.order - b.order)[0];
    const startDateStr = firstSegment?.startDate || "";
    const startDate = new Date(startDateStr + "T00:00:00"); // Parse as local date

    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr + "T23:59:59"); // End of today

    // Create map of dates to practice time
    const dateMap = new Map<string, number>();

    sessions.forEach((session) => {
      // Extract just the date part from ISO timestamp
      const date = session.date.split("T")[0];
      const currentTime = dateMap.get(date) || 0;
      dateMap.set(date, currentTime + session.time);
    });

    // Calculate number of days between start and today (inclusive)
    const daysDiff = Math.round(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Get the day of week for the first day to calculate proper week numbers
    const firstDayOfWeek = startDate.getDay();

    // Generate array from start date to today (inclusive)
    const days = [];
    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      // Format as YYYY-MM-DD in local timezone
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      const practiceTime = dateMap.get(dateStr) || 0;

      // Calculate week number accounting for first week offset
      const daysSinceStart = i + firstDayOfWeek;
      const weekNumber = Math.floor(daysSinceStart / 7);

      days.push({
        date: dateStr,
        practiceTime,
        dayOfWeek: currentDate.getDay(),
        weekNumber,
      });
    }

    return days;
  }, [sessions, exercises, segments]);

  const getIntensityColor = (time: number) => {
    if (time === 0) return "bg-gray-700";
    if (time < 600) return "bg-green-900/50"; // < 10 min
    if (time < 1800) return "bg-green-700/70"; // < 30 min
    if (time < 3600) return "bg-green-500"; // < 1 hour
    return "bg-green-400"; // >= 1 hour
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const weeks = useMemo(() => {
    if (heatmapData.length === 0) return [];

    const weekMap = new Map<number, typeof heatmapData>();

    // Pad the beginning if first day is not Sunday
    const firstDay = heatmapData[0];
    if (firstDay && firstDay.dayOfWeek !== 0) {
      // Add empty days before the first actual day
      for (let i = 0; i < firstDay.dayOfWeek; i++) {
        const emptyDay = {
          date: "",
          practiceTime: 0,
          dayOfWeek: i,
          weekNumber: 0,
        };
        const weekData = weekMap.get(0) || [];
        weekData.push(emptyDay);
        weekMap.set(0, weekData);
      }
    }

    heatmapData.forEach((day) => {
      const weekData = weekMap.get(day.weekNumber) || [];
      weekData.push(day);
      weekMap.set(day.weekNumber, weekData);
    });

    return Array.from(weekMap.values());
  }, [heatmapData]);

  const monthLabels = useMemo(() => {
    const labels: { month: string; position: number }[] = [];
    let currentMonth = "";

    heatmapData.forEach((day) => {
      const date = new Date(day.date);
      const month = date.toLocaleDateString("en-US", { month: "short" });

      if (month !== currentMonth) {
        currentMonth = month;
        labels.push({
          month,
          position: day.weekNumber,
        });
      }
    });

    return labels;
  }, [heatmapData]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!sessions || !exercises || !segments) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Practice Calendar
      </h2>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex gap-[2px] mb-2 ml-8">
            {monthLabels.map((label, index) => {
              const prevPosition =
                index > 0 ? monthLabels[index - 1].position : 0;
              const gap = label.position - prevPosition;
              return (
                <div
                  key={label.month + label.position}
                  style={{
                    marginLeft: index === 0 ? 0 : `${gap * 8}px`,
                  }}
                  className="text-xs text-gray-400"
                >
                  {label.month}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            {/* Day of week labels */}
            <div className="flex flex-col gap-[2px] text-xs text-gray-400 mr-1">
              {dayLabels.map((day, index) => (
                <div
                  key={day}
                  className="h-[10px] flex items-center"
                  style={{
                    visibility: index % 2 === 1 ? "visible" : "hidden",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-[2px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const day = week.find((d) => d.dayOfWeek === dayIndex);
                    const hasData = day && day.date !== "";
                    return (
                      <div
                        key={dayIndex}
                        className={`w-[10px] h-[10px] rounded-sm ${
                          hasData
                            ? getIntensityColor(day.practiceTime)
                            : "bg-transparent"
                        } ${
                          hasData
                            ? "hover:ring-2 hover:ring-indigo-400 cursor-pointer"
                            : ""
                        } transition-all`}
                        title={
                          hasData
                            ? `${day.date}: ${formatTime(day.practiceTime)}`
                            : ""
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 300, 1200, 2400, 3600].map((time) => (
                <div
                  key={time}
                  className={`w-[10px] h-[10px] rounded-sm ${getIntensityColor(
                    time
                  )}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeHeatmap;
