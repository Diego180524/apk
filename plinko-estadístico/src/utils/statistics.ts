import { DescriptiveStats, FrequencyRow } from '../types/plinko';

// Combination formula nCr
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  if (r > n / 2) r = n - r;
  let res = 1;
  for (let i = 1; i <= r; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return res;
}

// Binomial probability P(X = k) for Binomial(10, p)
export function getBinomialProb(k: number, p: number = 0.5, nLevels: number = 10): number {
  return nCr(nLevels, k) * Math.pow(p, k) * Math.pow(1 - p, nLevels - k);
}

// Calculate Frequency Table for 11 bins (0 to 10)
export function calculateFrequencyTable(data: number[], p: number = 0.5, nLevels: number = 10): FrequencyRow[] {
  const n = data.length;
  const counts: number[] = new Array(nLevels + 1).fill(0);

  data.forEach((val) => {
    if (val >= 0 && val <= nLevels) {
      counts[val]++;
    }
  });

  let cumAbs = 0;
  const rows: FrequencyRow[] = [];

  for (let k = 0; k <= nLevels; k++) {
    const absFreq = counts[k];
    const relFreq = n > 0 ? absFreq / n : 0;
    const percentFreq = relFreq * 100;

    cumAbs += absFreq;
    const cumRelFreq = n > 0 ? cumAbs / n : 0;
    const cumPercentFreq = cumRelFreq * 100;

    const theoreticalProb = getBinomialProb(k, p, nLevels);
    const theoreticalFreq = n * theoreticalProb;

    rows.push({
      bin: k,
      label: `Caja ${k}`,
      absFreq,
      relFreq,
      percentFreq,
      cumAbsFreq: cumAbs,
      cumRelFreq,
      cumPercentFreq,
      theoreticalProb,
      theoreticalFreq,
    });
  }

  return rows;
}

// Calculate Descriptive Statistics
export function calculateDescriptiveStats(data: number[]): DescriptiveStats {
  const n = data.length;

  if (n === 0) {
    return {
      n: 0,
      mean: 0,
      median: 0,
      mode: [],
      modeType: 'no-mode',
      min: 0,
      max: 0,
      range: 0,
      varianceSample: 0,
      stdDevSample: 0,
      variancePop: 0,
      stdDevPop: 0,
      cv: 0,
      skewness: 0,
      kurtosis: 0,
    };
  }

  // Mean
  const sum = data.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / n;

  // Sorted data for Median, Min, Max
  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Median
  let median = 0;
  const mid = Math.floor(n / 2);
  if (n % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  // Mode
  const freqMap = new Map<number, number>();
  let maxFreq = 0;
  data.forEach((val) => {
    const f = (freqMap.get(val) || 0) + 1;
    freqMap.set(val, f);
    if (f > maxFreq) maxFreq = f;
  });

  const modes: number[] = [];
  if (maxFreq > 1 || n === 1) {
    freqMap.forEach((freq, key) => {
      if (freq === maxFreq) modes.push(key);
    });
  }
  modes.sort((a, b) => a - b);

  let modeType: DescriptiveStats['modeType'] = 'unimodal';
  if (modes.length === 0) modeType = 'no-mode';
  else if (modes.length === 1) modeType = 'unimodal';
  else if (modes.length === 2) modeType = 'bimodal';
  else modeType = 'multimodal';

  // Variances & Std Devs
  const sumSqDiff = data.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
  const variancePop = sumSqDiff / n;
  const stdDevPop = Math.sqrt(variancePop);

  const varianceSample = n > 1 ? sumSqDiff / (n - 1) : 0;
  const stdDevSample = Math.sqrt(varianceSample);

  // Coeficiente de Variación (%)
  const cv = mean !== 0 ? (stdDevSample / mean) * 100 : 0;

  // Coeficiente de Asimetría de Pearson (3 * (Mean - Median) / StdDev)
  let skewness = 0;
  if (stdDevSample > 0) {
    // Fisher-Pearson skewness: m3 / (s^3)
    const m3 = data.reduce((acc, curr) => acc + Math.pow(curr - mean, 3), 0) / n;
    skewness = m3 / Math.pow(stdDevPop, 3);
  }

  // Kurtosis: m4 / (s^4) - 3 (excess kurtosis)
  let kurtosis = 0;
  if (stdDevPop > 0) {
    const m4 = data.reduce((acc, curr) => acc + Math.pow(curr - mean, 4), 0) / n;
    kurtosis = m4 / Math.pow(stdDevPop, 4) - 3;
  }

  return {
    n,
    mean,
    median,
    mode: modes,
    modeType,
    min,
    max,
    range,
    varianceSample,
    stdDevSample,
    variancePop,
    stdDevPop,
    cv,
    skewness,
    kurtosis,
  };
}

// Generate Automatic Dynamic Interpretation Text in Spanish
export function generateInterpretation(stats: DescriptiveStats, freqTable: FrequencyRow[]): {
  summary: string;
  details: string[];
  shape: 'bell' | 'right-skew' | 'left-skew' | 'uniform' | 'bimodal';
  recommendation: string;
} {
  if (stats.n === 0) {
    return {
      summary: 'Aún no se han lanzado pelotas. Inicie la simulación para generar un análisis estadístico.',
      details: [],
      shape: 'uniform',
      recommendation: 'Haz clic en "Lanzar 1 pelota" o "Lanzar 50 pelotas" para comenzar el experimento.',
    };
  }

  const { n, mean, median, mode, skewness, cv, stdDevSample } = stats;

  // Determine shape
  let shape: 'bell' | 'right-skew' | 'left-skew' | 'uniform' | 'bimodal' = 'bell';
  let summaryText = '';

  if (Math.abs(skewness) < 0.25) {
    shape = 'bell';
    summaryText = 'La mayoría de las pelotas cayeron cerca del centro (alrededor de x = 5), formando una distribución aproximadamente simétrica o bell-shaped (Normal).';
  } else if (skewness >= 0.25) {
    shape = 'right-skew';
    summaryText = 'Los datos presentan una ligera o moderada asimetría positiva hacia la derecha (valores más altos en las cajas inferiores 0-4).';
  } else {
    shape = 'left-skew';
    summaryText = 'Los datos presentan una ligera o moderada asimetría negativa hacia la izquierda (valores más altos en las cajas superiores 6-10).';
  }

  const details: string[] = [];

  // Central Tendency
  const modeStr = mode.length > 0 ? mode.join(', ') : 'Ninguna';
  details.push(
    `Tendencia Central: La media aritmética calculada es x̄ = ${mean.toFixed(2)}, con una mediana de ${median.toFixed(2)} y moda(s) en [${modeStr}].`
  );

  // Symmetry relationship
  if (Math.abs(mean - median) < 0.15) {
    details.push('Relación Media - Mediana: Media y Mediana coinciden casi exactamente (x̄ ≈ Me), lo cual es característico de distribuciones simétricas.');
  } else if (mean > median) {
    details.push('Relación Media - Mediana: La media es mayor que la mediana (x̄ > Me), lo que confirma un leve desplazamiento asimétrico hacia la derecha.');
  } else {
    details.push('Relación Media - Mediana: La media es menor que la mediana (x̄ < Me), lo que confirma un leve desplazamiento asimétrico hacia la izquierda.');
  }

  // Dispersion & Variability
  details.push(
    `Dispersión: La desviación estándar muestra una variación promedio de s = ${stdDevSample.toFixed(2)} compartimentos respecto al centro. El Coeficiente de Variación es de CV = ${cv.toFixed(1)}%.`
  );

  // Law of Large Numbers (Teorema del Límite Central)
  if (n < 30) {
    details.push(
      `Efecto del Tamaño Muestral (n = ${n}): Dado que la muestra es relativamente pequeña, se observan fluctuaciones aleatorias propias del azar muestral.`
    );
  } else if (n >= 30 && n < 100) {
    details.push(
      `Efecto del Tamaño Muestral (n = ${n}): A medida que n aumenta, la frecuencia observada empieza a converger visiblemente hacia la curva binomial teórica B(10, 0.5).`
    );
  } else {
    details.push(
      `Efecto del Tamaño Muestral (n = ${n}): Demostración directa de la Ley de los Grandes Números. La distribución empírica ajusta casi perfectamente con la distribución binomial teórica B(10, 0.5) con μ = 5 y σ² = 2.5.`
    );
  }

  let recommendation = '';
  if (n < 50) {
    recommendation = 'Sugerencia pedagógica: Presiona "Lanzar 50 pelotas" repetidamente para observar cómo la forma empírica se estabiliza en la campana gaussiana centrada en 5.';
  } else {
    recommendation = 'Sugerencia pedagógica: Observa la tabla de frecuencias para comparar la frecuencia relativa empírica (hᵢ) contra la probabilidad binomial teórica.';
  }

  return {
    summary: summaryText,
    details,
    shape,
    recommendation,
  };
}
