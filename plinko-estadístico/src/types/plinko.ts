export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  targetBin?: number;
  currentLevel: number;
  path: number[]; // 0 for left, 1 for right at each level
  isSettled: boolean;
  settledBin?: number;
  trail: { x: number; y: number; alpha: number }[];
}

export interface Peg {
  x: number;
  y: number;
  radius: number;
  level: number;
  index: number;
  lastHitTime?: number;
}

export interface FrequencyRow {
  bin: number;
  label: string;
  absFreq: number;       // f_i
  relFreq: number;       // h_i = f_i / n
  percentFreq: number;   // p_i = h_i * 100
  cumAbsFreq: number;    // F_i
  cumRelFreq: number;    // H_i
  cumPercentFreq: number;// P_i
  theoreticalProb: number; // P(X = x) binomial
  theoreticalFreq: number; // n * P(X = x)
}

export interface DescriptiveStats {
  n: number;
  mean: number;
  median: number;
  mode: number[];
  modeType: 'unimodal' | 'bimodal' | 'multimodal' | 'no-mode';
  min: number;
  max: number;
  range: number;
  varianceSample: number;
  stdDevSample: number;
  variancePop: number;
  stdDevPop: number;
  cv: number; // Coeficiente de variación (%)
  skewness: number; // Coeficiente de asimetría de Pearson
  kurtosis: number;
}

export interface SimulationState {
  data: number[]; // Array of landed bin indices [5, 4, 6, 5, 5...]
  isSimulating: boolean;
  totalToLaunch: number;
  launchedCount: number;
  completedCount: number;
  elapsedTimeMs: number;
  currentBallNumber: number;
  simulationSpeed: 'normal' | 'fast' | 'turbo' | 'instant';
  probabilityP: number; // Default 0.5 (bias left/right)
  soundEnabled: boolean;
}

export type ChartType = 'histogram' | 'bar' | 'polygon' | 'pie';
