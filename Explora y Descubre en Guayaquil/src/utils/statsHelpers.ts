export function calculateMean(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sum = nums.reduce((acc, val) => acc + val, 0);
  return Number((sum / nums.length).toFixed(1));
}

export function calculateMedian(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1));
  }
  return sorted[mid];
}

export function calculateMode(nums: number[]): number[] {
  if (nums.length === 0) return [];
  const freqMap: Record<number, number> = {};
  let maxFreq = 0;

  nums.forEach((n) => {
    freqMap[n] = (freqMap[n] || 0) + 1;
    if (freqMap[n] > maxFreq) {
      maxFreq = freqMap[n];
    }
  });

  const modes: number[] = [];
  Object.keys(freqMap).forEach((keyStr) => {
    const key = Number(keyStr);
    if (freqMap[key] === maxFreq && maxFreq > 1) {
      modes.push(key);
    }
  });

  return modes.length > 0 ? modes : [nums[0]];
}

export function calculateRange(nums: number[]): { min: number; max: number; range: number } {
  if (nums.length === 0) return { min: 0, max: 0, range: 0 };
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return { min, max, range: max - min };
}

export function calculateStdDev(nums: number[]): number {
  if (nums.length <= 1) return 0;
  const mean = calculateMean(nums);
  const variance = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / nums.length;
  return Number(Math.sqrt(variance).toFixed(1));
}
