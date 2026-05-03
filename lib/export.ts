import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

/**
 * Exports a DOM element as a PDF file
 * @param elementId The ID of the HTML element to capture
 * @param fileName The name of the file to download
 */
export const exportToPDF = async (elementId: string, fileName: string = "report.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

/**
 * Exports data to an Excel file
 * @param data The data to export (array of objects)
 * @param fileName The name of the file to download
 * @param sheetName The name of the worksheet
 */
export const exportToExcel = (data: Record<string, unknown>[], fileName: string = "report.xlsx", sheetName: string = "Data") => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate buffer and trigger download
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("Error generating Excel:", error);
  }
};
