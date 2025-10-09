import React from "react";
import {
  AllExercisesBpmChart,
  MonthByMonthChart,
  PracticeHeatmap,
  StreakStats,
  TimeDistributionChart,
  YearStats,
} from "./Summary";

interface PrintableReportProps {
  onReady?: () => void;
}

const PrintableReport = ({ onReady }: PrintableReportProps) => {
  // Notify parent when component is mounted and ready
  React.useEffect(() => {
    // Wait for all charts to render and styles to be applied
    const timer = setTimeout(() => {
      // Force a reflow to ensure all styles are computed
      const el = document.getElementById("printable-report");
      if (el) {
        void el.offsetHeight; // Trigger reflow
      }
      onReady?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <>
      {/* Override Tailwind's oklch colors with RGB */}
      <style>
        {`
          /* Force all colors in printable report to RGB to avoid oklch parsing errors */
          #printable-report * {
            --tw-bg-opacity: 1 !important;
            --tw-text-opacity: 1 !important;
            --tw-border-opacity: 1 !important;
          }
          
          /* Override Tailwind colors with RGB equivalents */
          #printable-report .bg-gray-900 { background-color: rgb(17, 24, 39) !important; }
          #printable-report .bg-gray-800 { background-color: rgb(31, 41, 55) !important; }
          #printable-report .bg-gray-700 { background-color: rgb(55, 65, 81) !important; }
          #printable-report .bg-gray-600 { background-color: rgb(75, 85, 99) !important; }
          #printable-report .text-white { color: rgb(255, 255, 255) !important; }
          #printable-report .text-gray-400 { color: rgb(156, 163, 175) !important; }
          #printable-report .text-gray-300 { color: rgb(209, 213, 219) !important; }
          #printable-report .text-gray-200 { color: rgb(229, 231, 235) !important; }
          #printable-report .text-indigo-400 { color: rgb(129, 140, 248) !important; }
          #printable-report .text-indigo-500 { color: rgb(99, 102, 241) !important; }
          #printable-report .text-green-400 { color: rgb(74, 222, 128) !important; }
          #printable-report .text-green-500 { color: rgb(34, 197, 94) !important; }
          #printable-report .text-blue-400 { color: rgb(96, 165, 250) !important; }
          #printable-report .text-blue-500 { color: rgb(59, 130, 246) !important; }
          #printable-report .text-purple-400 { color: rgb(192, 132, 252) !important; }
          #printable-report .text-purple-500 { color: rgb(168, 85, 247) !important; }
          #printable-report .border-gray-700 { border-color: rgb(55, 65, 81) !important; }
          #printable-report .border-gray-600 { border-color: rgb(75, 85, 99) !important; }
          
          /* Override Recharts colors */
          #printable-report .recharts-surface { background-color: transparent !important; }
          #printable-report .recharts-cartesian-grid-horizontal line,
          #printable-report .recharts-cartesian-grid-vertical line {
            stroke: rgb(55, 65, 81) !important;
          }
          #printable-report .recharts-text {
            fill: rgb(156, 163, 175) !important;
          }
        `}
      </style>
      <div
        id="printable-report"
        className="p-8 space-y-8"
        style={{
          width: "1200px",
          backgroundColor: "rgb(17, 24, 39)",
          colorScheme: "dark",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Drum Practice Report
          </h1>
          <p className="text-gray-400">
            Generated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Key Statistics */}
        <YearStats />

        {/* Streak Stats */}
        <StreakStats />

        {/* Month-by-Month Progress */}
        <MonthByMonthChart />

        {/* BPM Progress */}
        <AllExercisesBpmChart />

        {/* Practice Heatmap */}
        <PracticeHeatmap />

        {/* Time Distribution */}
        <TimeDistributionChart />
      </div>
    </>
  );
};

export default PrintableReport;
