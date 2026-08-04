import { DescriptiveStats, FrequencyRow, StatisticalInterpretation } from '../types/plinko';

// List of rotating Statistical Curiosities
const STATISTICAL_TRIVIA = [
  {
    title: 'El Origen del Tablero de Galton',
    fact: 'En 1889, el sabio británico Sir Francis Galton inventó este dispositivo (denominado Quincunx) para demostrar físicamente cómo el caos de colisiones aleatorias genera invariablemente la perfecta Campana de Gauss.',
    category: 'Historia y Física',
  },
  {
    title: 'La Ley de los Grandes Números en los Casinos',
    fact: 'Los casinos de Las Vegas y Montecarlo no dependen de la suerte. Con un tamaño muestral masivo (n enorme), las frecuencias observadas convergen con precisión matemática a la probabilidad esperada de la casa.',
    category: 'Juegos de Azar',
  },
  {
    title: 'Blaise Pascal y la Apuesta del Caballero Méré',
    fact: 'En 1654, el Caballero de Méré consultó a Blaise Pascal sobre un problema de dados no terminado en un casino. La correspondencia entre Pascal y Pierre de Fermat dio origen a la Teoría de la Probabilidad moderna.',
    category: 'Orígenes Matemáticos',
  },
  {
    title: 'La Regla Empírica 68 - 95 - 99.7',
    fact: 'En toda distribución aproximadamente normal, cerca del 68% de las pelotas caen a ±1 desviación estándar de la media, el 95% a ±2 desviaciones y el 99.7% a ±3 desviaciones.',
    category: 'Distribución Normal',
  },
  {
    title: 'El Triángulo de Pascal y los 1024 Caminos',
    fact: 'En un Plinko de 10 niveles existen 2¹⁰ = 1024 rutas únicas para caer. El número de caminos para llegar a cada compartimento k coincide exactamente con la fila 10 del Triángulo de Pascal: 1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1.',
    category: 'Combinatoria',
  },
  {
    title: '¿Por qué la Mediana es Resistente?',
    fact: 'A diferencia de la media, la mediana no se ve afectada por valores extremos o atípicos. Si una pelota cayera en la caja 1000, la mediana se mantendría casi intacta mientras la media se distorsionaría violentamente.',
    category: 'Estadística Robusta',
  },
];

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

  // Coeficiente de Asimetría de Pearson
  let skewness = 0;
  if (stdDevSample > 0) {
    const m3 = data.reduce((acc, curr) => acc + Math.pow(curr - mean, 3), 0) / n;
    skewness = m3 / Math.pow(stdDevPop, 3);
  }

  // Kurtosis
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

// Generate Automatic Dynamic Interpretation Text in Simple Human Language
export function generateInterpretation(
  stats: DescriptiveStats,
  freqTable: FrequencyRow[]
): StatisticalInterpretation {
  if (stats.n === 0) {
    return {
      summary: 'Aún no se han lanzado pelotas. Inicie la simulación en el casino para generar un análisis estadístico dinámico.',
      details: ['Seleccione una cantidad de pelotas (1, 5, 10, 25 o 50) para ejecutar la simulación.'],
      shapeClassification: 'Simétrica',
      dispersionClassification: 'Poco dispersa',
      rangeExplanation: 'Sin datos disponibles.',
      outlierExplanation: 'Sin datos disponibles.',
      learnedConclusion: 'Al presionar un botón de lanzamiento, observará cómo eventos aleatorios individuales suman sus efectos para formar patrones estadísticos predecibles.',
      trivia: STATISTICAL_TRIVIA[0],
    };
  }

  const { n, mean, median, mode, skewness, stdDevSample, range, min, max, cv } = stats;

  // 1. Shape Classification
  let shapeClassification: 'Simétrica' | 'Sesgada a la derecha' | 'Sesgada a la izquierda' = 'Simétrica';
  if (skewness > 0.22) {
    shapeClassification = 'Sesgada a la derecha';
  } else if (skewness < -0.22) {
    shapeClassification = 'Sesgada a la izquierda';
  }

  // 2. Dispersion Classification
  let dispersionClassification: 'Poco dispersa' | 'Dispersión moderada' | 'Muy dispersa' = 'Dispersión moderada';
  if (stdDevSample <= 1.25) {
    dispersionClassification = 'Poco dispersa';
  } else if (stdDevSample >= 1.8) {
    dispersionClassification = 'Muy dispersa';
  }

  // 3. Human Summary based on Sample Size n
  let summary = '';
  if (n <= 10) {
    summary = `Simulación con muestra reducida (n = ${n} pelotas). Con pocas pelotas, los resultados pueden variar considerablemente debido a la alta fluctuación muestral. El azar individual predomina y se perciben discrepancias respecto al modelo teórico B(10, p).`;
  } else {
    summary = `Simulación con n = ${n} pelotas. A medida que aumenta el tamaño de la muestra, la distribución empírica comienza a estabilizarse en torno a los compartimentos centrales y suele aproximarse de forma progresiva a una distribución normal.`;
  }

  // 4. Details list covering all required metrics
  const details: string[] = [];

  // Media
  details.push(`Comportamiento de la Media (x̄ = ${mean.toFixed(2)}): Representa el promedio ponderado del compartimento de llegada. En una máquina simétrica con p = 0.5, la media teórica es μ = 5.0.`);

  // Mediana
  details.push(`Comportamiento de la Mediana (Me = ${median.toFixed(2)}): Corta la muestra simulada exactamente en el 50% central. ${Math.abs(mean - median) <= 0.2 ? 'La cercanía entre la media y la mediana confirma un comportamiento bastante centrado.' : 'La diferencia entre la media y la mediana muestra ligera asimetría temporal en la muestra.'}`);

  // Moda
  if (mode.length > 0) {
    const modeStr = mode.join(', ');
    details.push(`Comportamiento de la Moda (Mo = ${modeStr}): Fue el compartimento más frecuente en esta simulación de n = ${n} datos.`);
  } else {
    details.push('Comportamiento de la Moda: En esta pequeña muestra no se identifica un único compartimento predominante.');
  }

  // Dispersión y Variabilidad
  details.push(`Dispersión y Variabilidad: La desviación estándar muestral fue s = ${stdDevSample.toFixed(2)} y el Coeficiente de Variación fue CV = ${cv.toFixed(1)}%. Esto indica una variabilidad ${cv < 30 ? 'baja' : cv < 50 ? 'moderada' : 'alta'} en las trayectorias de rebote.`);

  // Concentración de Resultados & Rango
  details.push(`Concentración de Resultados: Las pelotas se distribuyeron en un rango de R = ${range} compartimentos (desde la caja ${min} hasta la caja ${max}).`);

  // Simetría y Sesgo
  if (shapeClassification === 'Simétrica') {
    details.push(`Simetría de la Distribución: El coeficiente de asimetría (${skewness.toFixed(2)}) sugiere una forma simétrica y equilibrada alrededor del centro.`);
  } else if (shapeClassification === 'Sesgada a la derecha') {
    details.push(`Sesgo a la Derecha: Se observa una concentración mayor en las cajas inferiores (0 a 4) con una cola que se extiende hacia la derecha.`);
  } else {
    details.push(`Sesgo a la Izquierda: Se observa una concentración mayor en las cajas superiores (6 a 10) con una cola que se extiende hacia la izquierda.`);
  }

  // Comportamiento General de la Distribución
  if (n <= 10) {
    details.push('Comportamiento General: Para muestras pequeñas (n ≤ 10), es completamente normal observar irregularidades en las frecuencias relativas debido a la variabilidad aleatoria.');
  } else {
    details.push('Comportamiento General: Para muestras de 25 o 50 pelotas, la distribución ilustra con claridad cómo los rebotes aleatorios convergen hacia la clásica Campana de Gauss.');
  }

  const rangeExplanation = `Rango muestral: R = ${range} (mínimo = ${min}, máximo = ${max}).`;
  let outlierExplanation = 'No se observan valores atípicos; todos los datos pertenecen al rango válido del Plinko [0, 10].';
  if (min === 0 || max === 10) {
    outlierExplanation = `Se registraron caídas en los compartimentos extremos (caja ${min === 0 ? '0' : ''}${min === 0 && max === 10 ? ' y ' : ''}${max === 10 ? '10' : ''}), lo que confirma que todos los compartimentos del tablero registraron resultados físicos correctamente.`;
  }

  // 5. Mensaje Educativo Adaptativo
  let learnedConclusion = '';
  if (n <= 10) {
    learnedConclusion = `A medida que aumenta el número de pelotas, la distribución de los resultados tiende a concentrarse alrededor del centro, mostrando un comportamiento más estable. En esta muestra pequeña (n = ${n}), observamos la variabilidad inherente al azar antes de que actúe la Ley de los Grandes Números.`;
  } else if (n <= 25) {
    learnedConclusion = `A medida que aumenta el número de pelotas (n = ${n}), la distribución de los resultados tiende a concentrarse alrededor del centro, mostrando un comportamiento más estable. Esto permite comprender cómo influye el tamaño de la muestra en el análisis estadístico y en la reducción del margen de error.`;
  } else {
    learnedConclusion = `A medida que aumenta el número de pelotas (n = ${n}), la distribución de los resultados tiende a concentrarse alrededor del centro, mostrando un comportamiento más estable. Esta simulación demuestra de forma práctica el Teorema del Límite Central y la convergencia de la distribución Binomial hacia la Normal.`;
  }

  // 6. Curiosidad Estadística
  const triviaIndex = Math.abs(Math.floor(n + mean * 10)) % STATISTICAL_TRIVIA.length;
  const trivia = STATISTICAL_TRIVIA[triviaIndex];

  return {
    summary,
    details,
    shapeClassification,
    dispersionClassification,
    rangeExplanation,
    outlierExplanation,
    learnedConclusion,
    trivia,
  };
}

