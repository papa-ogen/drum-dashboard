import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components";
import { SegmentProvider } from "./contexts/SegmentContext";
import Dashboard from "./pages/Dashboard";
import Summary from "./pages/Summary";

export default function App() {
  return (
    <BrowserRouter>
      <SegmentProvider>
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

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
          </div>
        </div>
      </SegmentProvider>
    </BrowserRouter>
  );
}
