import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { BatsmanComfortReport } from '../types';

export interface ExportPdfOptions {
  theme?: 'dark' | 'light';
  quality?: number;
}

/**
 * Loads an image src to determine its natural dimensions.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Fallback vector PDF generator targeting specifically the Graph Section.
 */
function generateFallbackGraphVectorPdf(report: BatsmanComfortReport) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;

  // Background
  pdf.setFillColor(15, 23, 42); // #0F172A
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  let y = 22;

  // Header
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(129, 140, 248); // indigo-400
  pdf.text('CRICKET MATCHUP ANALYTICS • GRAPH SECTION', pageWidth / 2, y, { align: 'center' });
  y += 9;

  // Batsman Name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text((report.batsmanName || 'BATSMAN').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 7;

  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(13);
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text(report.comfortTitle || 'Comfort Level', pageWidth / 2, y, { align: 'center' });
  y += 14;

  // Chart Container Card
  const cardX = margin;
  const cardW = pageWidth - margin * 2;
  const cardH = 135;
  pdf.setFillColor(19, 29, 51);
  pdf.roundedRect(cardX, y, cardW, cardH, 4, 4, 'F');
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.2);

  // Bars Section
  let barY = y + 16;
  const labelX = cardX + 16;
  const barStartX = cardX + 38;
  const maxBarW = 100;
  const maxVal = Math.max(50, ...report.bowlingCategories.map((c) => c.average));

  // Ticks at 0, 10, 20, 30, 40, 50
  pdf.setFontSize(7.5);
  pdf.setTextColor(148, 163, 184);
  [0, 10, 20, 30, 40, 50].forEach((tick) => {
    const tickX = barStartX + (tick / maxVal) * maxBarW;
    pdf.text(String(tick), tickX, barY - 4, { align: 'center' });
    pdf.setDrawColor(51, 65, 85);
    pdf.line(tickX, barY - 2, tickX, barY + 58);
  });

  // Draw Horizontal Bars
  report.bowlingCategories.forEach((cat) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text(cat.code, labelX, barY + 5);

    // Bar rect
    const barWidth = Math.max(1, (cat.average / maxVal) * maxBarW);
    // Bar color
    if (cat.average >= 45) pdf.setFillColor(52, 211, 153); // emerald
    else if (cat.average >= 30) pdf.setFillColor(96, 165, 250); // blue
    else if (cat.average >= 20) pdf.setFillColor(251, 191, 36); // amber
    else pdf.setFillColor(248, 113, 113); // rose

    pdf.roundedRect(barStartX, barY, barWidth, 7, 1.5, 1.5, 'F');

    // Value label
    pdf.setFontSize(8.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text(cat.average.toFixed(0), barStartX + barWidth + 3, barY + 5.5);

    barY += 12;
  });

  // Dismissals Distribution Box inside card
  const matrixY = y + 84;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text('DISMISSALS BREAKDOWN BY BOWLER TYPE', cardX + 16, matrixY);

  const tableY = matrixY + 4;
  const colW = (cardW - 32) / Math.max(1, report.dismissalsTable.length);

  report.dismissalsTable.forEach((d, i) => {
    const colX = cardX + 16 + i * colW;
    pdf.setFillColor(15, 23, 42);
    pdf.roundedRect(colX, tableY, colW - 2, 22, 2, 2, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text(d.bowlerType, colX + (colW - 2) / 2, tableY + 7, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text(String(d.count), colX + (colW - 2) / 2, tableY + 16, { align: 'center' });
  });

  y += cardH + 16;

  // Key stats summary pill
  pdf.setFillColor(26, 38, 66);
  pdf.roundedRect(margin, y, cardW, 24, 3, 3, 'F');

  pdf.setFontSize(8);
  pdf.setTextColor(129, 140, 248);
  pdf.text('DOMINANT MATCHUP', margin + 8, y + 8);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(report.dominantBowlingType || 'RAFM', margin + 8, y + 16);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(248, 113, 113);
  pdf.text('MOST VULNERABLE MATCHUP', margin + 65, y + 8);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(report.mostVulnerableBowlingType || 'LAFM', margin + 65, y + 16);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(52, 211, 153);
  pdf.text('OVERALL COMFORT SCORE', margin + 130, y + 8);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`${report.overallComfortScore || 0} / 100`, margin + 130, y + 16);

  // Footer
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    `Cricket Batsman Comfort Level • Graph Export • ${report.batsmanName || 'Batsman'}`,
    margin,
    pageHeight - 8
  );
  pdf.text(
    `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    pageWidth - margin,
    pageHeight - 8,
    { align: 'right' }
  );

  const safeName = (report.batsmanName || 'Batsman').replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`${safeName}_Comfort_Level_Graph.pdf`);
}

/**
 * Exports ONLY the Graph Section as a high-resolution PDF.
 * Captures specifically the comfort-level-chart-container element.
 */
export async function exportReportToPdf(
  elementId: string = 'comfort-level-chart-container',
  report: BatsmanComfortReport,
  options: ExportPdfOptions = {}
): Promise<boolean> {
  const targetId = elementId || 'comfort-level-chart-container';
  const element = document.getElementById(targetId);

  if (!element) {
    console.warn(`Element with id "${targetId}" not found for Graph PDF export. Using vector fallback.`);
    generateFallbackGraphVectorPdf(report);
    return true;
  }

  const { theme = 'dark' } = options;

  try {
    // Generate high-resolution image using html-to-image
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2.5,
      backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
      cacheBust: true,
      filter: (node) => {
        // Exclude action buttons, links, or edit controls inside the graph card
        if (
          node instanceof HTMLElement &&
          (node.classList.contains('no-print') ||
            node.hasAttribute('data-no-print') ||
            node.tagName === 'BUTTON')
        ) {
          return false;
        }
        return true;
      },
    });

    const img = await loadImage(dataUrl);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15; // 15mm margin
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (img.naturalHeight * contentWidth) / img.naturalWidth;

    // Background color matching the Sleek theme
    pdf.setFillColor(10, 15, 30); // #0A0F1E
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header label
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(129, 140, 248); // indigo-400
    pdf.text('CRICKET BATSMAN MATCHUP ANALYTICS • GRAPH SECTION', pageWidth / 2, 16, {
      align: 'center',
    });

    // Center the graph card vertically if it fits on a single page
    let positionY = 22;
    if (contentHeight < pageHeight - 48) {
      positionY = Math.max(22, (pageHeight - contentHeight) / 2 - 6);
    }

    pdf.addImage(dataUrl, 'PNG', margin, positionY, contentWidth, contentHeight, undefined, 'FAST');

    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139); // slate-500
    pdf.text(
      `Cricket Batsman Comfort Level • ${report.batsmanName || 'Batsman'} • Graph Section Export`,
      margin,
      pageHeight - 8
    );
    pdf.text(
      `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );

    const safeName = (report.batsmanName || 'Batsman').replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`${safeName}_Comfort_Level_Graph.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF via html-to-image, falling back to vector PDF:', error);
    try {
      generateFallbackGraphVectorPdf(report);
      return true;
    } catch (fallbackErr) {
      console.error('Vector fallback failed, launching print dialog:', fallbackErr);
      window.print();
      return false;
    }
  }
}
