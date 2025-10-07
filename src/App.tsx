import { Toaster } from "react-hot-toast";
import {
  AlbumSearch,
  ChartContainer,
  Header,
  KeyStats,
  SessionLogger,
  TotalTimePerExercise,
} from "./components";

export default function App() {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f3f4f6",
            border: "1px solid #374151",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#f3f4f6",
            },
          },
        }}
      />
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <SessionLogger />
            <KeyStats />
            <AlbumSearch />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <ChartContainer />
            <TotalTimePerExercise />
          </div>
        </main>
      </div>
    </div>
  );
}
