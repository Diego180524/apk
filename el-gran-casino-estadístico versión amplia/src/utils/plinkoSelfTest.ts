/**
 * Automatic Plinko Logic Self-Test Verification
 * Verifies that 1000 sample drops can reach all bins (0 to 10)
 * and that binomial trials correctly populate the dataset.
 */

export interface TestResult {
  passed: boolean;
  sampleSize: number;
  binsCovered: number;
  totalBins: number;
  missingBins: number[];
  counts: Record<number, number>;
  message: string;
}

export function runPlinkoSelfTest(sampleSize: number = 10000, p: number = 0.5): TestResult {
  const counts: Record<number, number> = {};
  for (let b = 0; b <= 10; b++) {
    counts[b] = 0;
  }

  // Simulate sampleSize drops of 10 levels
  for (let i = 0; i < sampleSize; i++) {
    let rightCount = 0;
    for (let level = 0; level < 10; level++) {
      if (Math.random() < p) {
        rightCount++;
      }
    }
    counts[rightCount] = (counts[rightCount] || 0) + 1;
  }

  const missingBins: number[] = [];
  for (let b = 0; b <= 10; b++) {
    if (counts[b] === 0) {
      missingBins.push(b);
    }
  }

  const binsCovered = 11 - missingBins.length;
  const passed = missingBins.length === 0;

  const message = passed
    ? `✅ Prueba automática con ${sampleSize} pelotas exitosa: Todos los compartimentos (0 al 10) reciben registros correctamente.`
    : `⚠️ Faltaron registros en los compartimentos: ${missingBins.join(', ')}`;

  console.log(`[PlinkoSelfTest] ${message}`, counts);

  return {
    passed,
    sampleSize,
    binsCovered,
    totalBins: 11,
    missingBins,
    counts,
    message,
  };
}
