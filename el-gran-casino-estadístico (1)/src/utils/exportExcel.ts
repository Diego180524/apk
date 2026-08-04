import * as XLSX from 'xlsx';
import { DescriptiveStats, FrequencyRow } from '../types/plinko';

export function exportToExcel(
  stats: DescriptiveStats,
  freqTable: FrequencyRow[],
  rawData: number[],
  interpretation: { summary: string; details: string[] }
) {
  const wb = XLSX.utils.book_new();

  // 1. Resumen Estadístico Sheet
  const summaryData = [
    ['SIMULADOR PLINKO ESTADÍSTICO - INFORME COMPLETO'],
    ['Fecha de Generación', new Date().toLocaleString('es-ES')],
    [],
    ['MEDIDA ESTADÍSTICA', 'SÍMBOLO / FÓRMULA', 'VALOR OBTENIDO', 'UNIDAD / DESCRIPCIÓN'],
    ['Número de datos', 'n', stats.n, 'Pelotas lanzadas'],
    ['Media Aritmética', 'x̄ = Σx / n', Number(stats.mean.toFixed(4)), 'Compartimento promedio'],
    ['Mediana', 'Me', Number(stats.median.toFixed(4)), 'Posición central (50%)'],
    ['Moda', 'Mo', stats.mode.join(', ') || 'Sin moda', 'Valor(es) de mayor frecuencia'],
    ['Mínimo', 'Min', stats.min, 'Compartimento mínimo observado'],
    ['Máximo', 'Max', stats.max, 'Compartimento máximo observado'],
    ['Rango', 'R = Max - Min', stats.range, 'Amplitud de datos'],
    ['Varianza Muestral', 's²', Number(stats.varianceSample.toFixed(4)), 'Dispersión cuadrática'],
    ['Desviación Estándar Muestral', 's = √s²', Number(stats.stdDevSample.toFixed(4)), 'Dispersión en compartimentos'],
    ['Varianza Poblacional', 'σ²', Number(stats.variancePop.toFixed(4)), 'Varianza N'],
    ['Desviación Estándar Poblacional', 'σ', Number(stats.stdDevPop.toFixed(4)), 'Desviación N'],
    ['Coeficiente de Variación', 'CV = (s / x̄) * 100', `${stats.cv.toFixed(2)}%`, 'Variabilidad relativa'],
    ['Coeficiente de Asimetría (Fisher)', 'A_s', Number(stats.skewness.toFixed(4)), 'Simetría de la distribución'],
    ['Curtosis (Exceso)', 'g₂', Number(stats.kurtosis.toFixed(4)), 'Apuntamiento'],
    [],
    ['INTERPRETACIÓN AUTOMÁTICA'],
    ['Síntesis', interpretation.summary],
    ...interpretation.details.map((d) => ['Detalle', d]),
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

  // Auto-fit column widths
  wsSummary['!cols'] = [{ wch: 32 }, { wch: 25 }, { wch: 22 }, { wch: 45 }];

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen Estadístico');

  // 2. Tabla de Frecuencias Sheet
  const freqHeader = [
    'Compartimento (Caja x)',
    'Frecuencia Absoluta (f_i)',
    'Frecuencia Relativa (h_i)',
    'Frecuencia Porcentual (p_i %)',
    'Frecuencia Acumulada Absoluta (F_i)',
    'Frecuencia Acumulada Relativa (H_i)',
    'Frecuencia Acumulada Porcentual (P_i %)',
    'Probabilidad Binomial Teórica P(X=x)',
    'Frecuencia Teórica Esperada (n * P)',
  ];

  const freqRows = freqTable.map((row) => [
    row.bin,
    row.absFreq,
    Number(row.relFreq.toFixed(6)),
    `${row.percentFreq.toFixed(2)}%`,
    row.cumAbsFreq,
    Number(row.cumRelFreq.toFixed(6)),
    `${row.cumPercentFreq.toFixed(2)}%`,
    Number(row.theoreticalProb.toFixed(6)),
    Number(row.theoreticalFreq.toFixed(2)),
  ]);

  // Totals row
  freqRows.push([
    'TOTAL (Σ)',
    stats.n,
    1.0,
    '100.00%',
    '-',
    '-',
    '-',
    1.0,
    stats.n,
  ]);

  const wsFreq = XLSX.utils.aoa_to_sheet([freqHeader, ...freqRows]);
  wsFreq['!cols'] = [
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 25 },
    { wch: 28 },
    { wch: 28 },
    { wch: 30 },
    { wch: 32 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(wb, wsFreq, 'Tabla de Frecuencias');

  // 3. Registro Crudo Sheet
  const rawHeader = ['N° Pelota', 'Compartimento de Caída (Dato x_i)'];
  const rawRows = rawData.map((val, idx) => [idx + 1, val]);

  const wsRaw = XLSX.utils.aoa_to_sheet([rawHeader, ...rawRows]);
  wsRaw['!cols'] = [{ wch: 15 }, { wch: 32 }];

  XLSX.utils.book_append_sheet(wb, wsRaw, 'Datos Crudos (Muestra)');

  // Download File
  const filename = `Plinko_Estadistico_Resultados_n${stats.n}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}
