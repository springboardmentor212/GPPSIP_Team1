import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Generate a PDF report and download it automatically.
 * @param {string} title - The title of the report
 * @param {Array<string>} headers - Table column headers
 * @param {Array<Array<string|number>>} data - Table data rows
 * @param {string} filename - Output filename without extension
 */
export const downloadPDF = (title, headers, data, filename = 'report') => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Date timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // AutoTable
  doc.autoTable({
    startY: 36,
    head: [headers],
    body: data,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [0, 82, 204], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`${filename}-${new Date().getTime()}.pdf`);
};

/**
 * Generate an Excel file and download it automatically.
 * @param {string} sheetName - The name of the worksheet
 * @param {Array<Object>} data - Array of objects representing the rows
 * @param {string} filename - Output filename without extension
 */
export const downloadExcel = (sheetName, data, filename = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, `${filename}-${new Date().getTime()}.xlsx`);
};
