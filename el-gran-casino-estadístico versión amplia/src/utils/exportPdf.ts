import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DescriptiveStats, FrequencyRow } from '../types/plinko';

export function exportToPdf(
  stats: DescriptiveStats,
  freqTable: FrequencyRow[],
  interpretation: { summary: string; details: string[] }
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryBlue = [30, 64, 175]; // #1E40AF
  const primaryPurple = [109, 40, 217]; // #6D28D9
  const darkGray = [30, 41, 59];

  // Header Banner
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
  doc.rect(0, 25, 210, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PLINKO ESTADÍSTICO - INFORME COMPLETO', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Simulador para Estadística Descriptiva | Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 22);

  let currentY = 36;

  // Title Section
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('1. MEDIDAS DE ESTADÍSTICA DESCRIPTIVA', 14, currentY);
  currentY += 6;

  // Stats Table
  const statsRows = [
    ['Número de Datos (n)', `${stats.n} pelotas`, 'Varianza Muestral (s²)', stats.varianceSample.toFixed(4)],
    ['Media Aritmética (x̄)', stats.mean.toFixed(4), 'Desviación Estándar (s)', stats.stdDevSample.toFixed(4)],
    ['Mediana (Me)', stats.median.toFixed(4), 'Coeficiente de Variación (CV)', `${stats.cv.toFixed(2)}%`],
    ['Moda (Mo)', stats.mode.join(', ') || 'Sin moda', 'Asimetría (Pearson)', stats.skewness.toFixed(4)],
    ['Mínimo - Máximo', `${stats.min} - ${stats.max}`, 'Rango (R)', `${stats.range}`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Parámetro', 'Valor', 'Parámetro', 'Valor']],
    body: statsRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryBlue as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: darkGray as [number, number, number],
      fontSize: 8.5,
    },
    styles: {
      cellPadding: 2.5,
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Section 2: Frequency Table
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('2. TABLA DE FRECUENCIAS', 14, currentY);
  currentY += 6;

  const freqHead = [
    ['Caja (x)', 'f_i (Abs)', 'h_i (Rel)', 'p_i (%)', 'F_i (Acum)', 'P_i (%)', 'P(X) Teórica'],
  ];

  const freqBody = freqTable.map((row) => [
    `Caja ${row.bin}`,
    row.absFreq.toString(),
    row.relFreq.toFixed(4),
    `${row.percentFreq.toFixed(1)}%`,
    row.cumAbsFreq.toString(),
    `${row.cumPercentFreq.toFixed(1)}%`,
    row.theoreticalProb.toFixed(4),
  ]);

  freqBody.push([
    'TOTAL',
    stats.n.toString(),
    '1.0000',
    '100.0%',
    '-',
    '-',
    '1.0000',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: freqHead,
    body: freqBody,
    theme: 'striped',
    headStyles: {
      fillColor: primaryPurple as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      textColor: darkGray as [number, number, number],
      fontSize: 8,
    },
    styles: {
      cellPadding: 2,
      halign: 'center',
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Check if we need new page for interpretation
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Section 3: Automatic Interpretation
  doc.setFillColor(248, 250, 252);
  doc.rect(14, currentY, 182, 45, 'F');
  doc.setDrawColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
  doc.setLineWidth(0.8);
  doc.line(14, currentY, 14, currentY + 45);

  doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. ANÁLISIS ESTADÍSTICO DESCRIPTIVO', 18, currentY + 7);

  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const summaryLines = doc.splitTextToSize(interpretation.summary, 172);
  doc.text(summaryLines, 18, currentY + 14);

  let detailY = currentY + 22;
  interpretation.details.slice(0, 3).forEach((detail) => {
    const lines = doc.splitTextToSize(`• ${detail}`, 172);
    doc.text(lines, 18, detailY);
    detailY += lines.length * 4.5;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount} | Generado por Plinko Estadístico App`,
      105,
      287,
      { align: 'center' }
    );
  }

  const filename = `Plinko_Estadistico_Informe_n${stats.n}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
