import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePracticeReportFromElement = async (
  elementId: string = "printable-report"
) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Small delay to ensure styles are fully applied
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Capture the entire report as a high-quality image
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#111827",
      logging: true, // Enable logging to see what's happening
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
      imageTimeout: 15000,
      windowWidth: 1200,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    // Create PDF in landscape if content is wide, portrait otherwise
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const aspectRatio = imgWidth / imgHeight;

    // Use A4 dimensions
    const pdf = new jsPDF({
      orientation: aspectRatio > 1.4 ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions to fit the page with margins
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    let finalWidth = maxWidth;
    let finalHeight = (imgHeight * maxWidth) / imgWidth;

    // If height exceeds page, scale by height instead
    if (finalHeight > maxHeight) {
      finalHeight = maxHeight;
      finalWidth = (imgWidth * maxHeight) / imgHeight;
    }

    // Center the image
    const xOffset = (pageWidth - finalWidth) / 2;
    const yOffset = (pageHeight - finalHeight) / 2;

    // Add image to PDF
    pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);

    // If content is very tall, split across multiple pages
    if (imgHeight / imgWidth > 2) {
      const pagesNeeded = Math.ceil(imgHeight / (imgWidth * 1.4));

      for (let i = 1; i < pagesNeeded; i++) {
        pdf.addPage();

        // Calculate which section of the image to show
        const sectionHeight = imgHeight / pagesNeeded;
        const sectionCanvas = document.createElement("canvas");
        const sectionCtx = sectionCanvas.getContext("2d");

        if (sectionCtx) {
          sectionCanvas.width = imgWidth;
          sectionCanvas.height = sectionHeight;

          sectionCtx.drawImage(
            canvas,
            0,
            sectionHeight * i,
            imgWidth,
            sectionHeight,
            0,
            0,
            imgWidth,
            sectionHeight
          );

          const sectionImgData = sectionCanvas.toDataURL("image/png");
          const sectionFinalHeight = (sectionHeight * maxWidth) / imgWidth;

          pdf.addImage(
            sectionImgData,
            "PNG",
            margin,
            margin,
            maxWidth,
            sectionFinalHeight
          );
        }
      }
    }

    // Save PDF
    const fileName = `drum-practice-report-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw error;
  }
};
