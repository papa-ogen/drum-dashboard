import { useState } from "react";
import { createRoot } from "react-dom/client";
import { useSessions } from "../utils/api";
import { generatePracticeReportFromElement } from "../utils/pdfGenerator";
import PrintableReport from "./PrintableReport";

const GeneratePDFButton = () => {
  const { sessions } = useSessions();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (!sessions || sessions.length === 0) {
      alert("No session data available to generate report");
      return;
    }

    setIsGenerating(true);

    // Create a temporary container for the printable report
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "1200px";
    container.style.height = "auto";
    container.style.zIndex = "-9999";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);

    try {
      // Render the printable report off-screen
      const root = createRoot(container);

      await new Promise<void>((resolve) => {
        root.render(<PrintableReport onReady={resolve} />);
      });

      // Generate PDF from the rendered component
      await generatePracticeReportFromElement("printable-report");

      // Cleanup
      root.unmount();
      document.body.removeChild(container);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF report. Please try again.");

      // Cleanup on error
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
    >
      {isGenerating ? "Generating..." : "📄 Download PDF Report"}
    </button>
  );
};

export default GeneratePDFButton;
