import jsPDF from 'jspdf';
import type { JournalEntry } from '../api/types';

export function exportJournalPdf(entries: JournalEntry[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Header
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('MindSphere Journal Export', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Entries
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  entries.forEach((entry, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(new Date(entry.created_at).toLocaleDateString(), margin, yPosition);
    yPosition += 8;

    // Summary
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const summaryLines = doc.splitTextToSize(entry.summary, contentWidth);
    doc.text(summaryLines, margin, yPosition);
    yPosition += (summaryLines.length * 4) + 5;

    // Emotions
    if (entry.emotions.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Emotions: ${entry.emotions.join(', ')}`, margin, yPosition);
      yPosition += 8;
    }

    yPosition += 10;
  });

  // Save
  doc.save(`journals_${new Date().toISOString().split('T')[0]}.pdf`);
}
