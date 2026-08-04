/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { PlinkoCanvas } from './components/PlinkoCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { StatsCards } from './components/StatsCards';
import { FrequencyTable } from './components/FrequencyTable';
import { ChartsSection } from './components/ChartsSection';
import { InterpretationCard } from './components/InterpretationCard';
import { ExportModal } from './components/ExportModal';
import { TheoryModal } from './components/TheoryModal';

import {
  calculateDescriptiveStats,
  calculateFrequencyTable,
  generateInterpretation,
} from './utils/statistics';
import { runPlinkoSelfTest, TestResult } from './utils/plinkoSelfTest';

export default function App() {
  // Automatic Plinko self test on load
  const [testStatus, setTestStatus] = useState<TestResult | null>(null);

  useEffect(() => {
    const result = runPlinkoSelfTest(1000, 0.5);
    setTestStatus(result);
  }, []);
  // Main data state: array of landed bin indexes [5, 4, 6, 5, 5, 2...]
  const [data, setData] = useState<number[]>([]);

  // Simulation controls state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [totalToLaunch, setTotalToLaunch] = useState<number>(0);
  const [launchedCount, setLaunchedCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [simulationSpeed, setSimulationSpeed] = useState<'normal' | 'fast' | 'turbo' | 'instant'>('normal');
  const [probabilityP, setProbabilityP] = useState<number>(0.5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Timer state
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Layout / Frame toggle
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState<boolean>(false);

  // Calculated Statistics & Frequency Table Memoized
  const stats = useMemo(() => calculateDescriptiveStats(data), [data]);
  const freqTable = useMemo(() => calculateFrequencyTable(data, probabilityP, 10), [data, probabilityP]);
  const interpretation = useMemo(() => generateInterpretation(stats, freqTable), [stats, freqTable]);

  // Timer effect
  useEffect(() => {
    if (isSimulating) {
      const startTime = Date.now() - elapsedTimeMs;
      timerRef.current = setInterval(() => {
        setElapsedTimeMs(Date.now() - startTime);
      }, 50);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating]);

  // Buffer ref to store landed balls during simulation batch to avoid heavy re-renders on every ball drop
  const landedBufferRef = useRef<number[]>([]);

  // Launch handler ("Lanzar 1 pelota", "Lanzar 5 pelotas", "Lanzar 10 pelotas", "Lanzar 25 pelotas", "Lanzar 50 pelotas")
  const handleLaunch = (count: number) => {
    if (isSimulating) return;

    landedBufferRef.current = [];
    setData([]);
    setTotalToLaunch(count);
    setLaunchedCount(0);
    setCompletedCount(0);
    setElapsedTimeMs(0);
    setIsSimulating(true);
  };

  // Ball landed callback (lightweight progress counter update during simulation)
  const handleBallLanded = useCallback((binIndex: number) => {
    landedBufferRef.current.push(binIndex);
    setCompletedCount((prev) => prev + 1);
    setLaunchedCount((prev) => prev + 1);
  }, []);

  // Batch finish callback (calculates stats and updates charts ONLY ONCE when simulation finishes)
  const handleBatchFinished = useCallback(() => {
    setIsSimulating(false);
    // Update main dataset ONCE at the end of simulation
    setData([...landedBufferRef.current]);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
      });
    } catch {
      // Ignore confetti errors
    }
  }, []);

  // Reset simulation handler
  const handleReset = () => {
    landedBufferRef.current = [];
    setIsSimulating(false);
    setData([]);
    setTotalToLaunch(0);
    setLaunchedCount(0);
    setCompletedCount(0);
    setElapsedTimeMs(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 pb-12">
      {/* Header Bar */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenTheory={() => setIsTheoryModalOpen(true)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame((prev) => !prev)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Optional Android Smartphone Mockup Wrapper */}
        <div
          className={`transition-all duration-300 mx-auto ${
            isMobileFrame
              ? 'max-w-[420px] bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-amber-500/40 ring-1 ring-amber-400/30 my-2'
              : 'w-full'
          }`}
        >
          {/* Smartphone Status Bar (When in mobile frame view) */}
          {isMobileFrame && (
            <div className="flex items-center justify-between px-4 py-1.5 text-[11px] font-bold text-amber-400/80 mb-2">
              <span>09:41</span>
              <div className="w-16 h-4 bg-slate-900 rounded-full mx-auto border border-amber-500/30" />
              <div className="flex items-center space-x-1">
                <span>5G VIP</span>
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Upper Grid: Plinko Canvas & Controls Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Plinko Simulator Board */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block shadow-sm shadow-amber-400/50" />
                    <span>Tablero de Plinko Casino (10 Niveles)</span>
                  </h2>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-400/30 shadow-md">
                    Máquina Galton B(10, {probabilityP})
                  </span>
                </div>

                <PlinkoCanvas
                  data={data}
                  onBallLanded={handleBallLanded}
                  onBatchFinished={handleBatchFinished}
                  isSimulating={isSimulating}
                  totalToLaunch={totalToLaunch}
                  launchedCount={launchedCount}
                  completedCount={completedCount}
                  simulationSpeed={simulationSpeed}
                  probabilityP={probabilityP}
                  soundEnabled={soundEnabled}
                />
              </div>

              {/* Controls & Real-Time Status */}
              <div className="lg:col-span-5 space-y-3">
                <div className="px-1">
                  <h2 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest">
                    Panel de Apuestas & Control Estadístico
                  </h2>
                </div>

                <ControlsPanel
                  onLaunch={handleLaunch}
                  onReset={handleReset}
                  isSimulating={isSimulating}
                  launchedCount={launchedCount}
                  totalToLaunch={totalToLaunch}
                  completedCount={completedCount}
                  elapsedTimeMs={elapsedTimeMs}
                  simulationSpeed={simulationSpeed}
                  onChangeSpeed={setSimulationSpeed}
                  probabilityP={probabilityP}
                  onChangeP={setProbabilityP}
                />
              </div>
            </div>

            {/* Descriptive Statistics Cards */}
            <StatsCards stats={stats} />

            {/* Automatic Statistical Interpretation & Export */}
            <InterpretationCard
              interpretation={interpretation}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              n={stats.n}
            />

            {/* Frequency Table */}
            <FrequencyTable freqTable={freqTable} n={stats.n} />

            {/* Charts Section (Histogram, Bar, Polygon, Pie) */}
            <ChartsSection freqTable={freqTable} n={stats.n} />
          </div>

          {/* Smartphone Navigation Bar (When in mobile frame view) */}
          {isMobileFrame && (
            <div className="pt-4 flex justify-center">
              <div className="w-32 h-1 bg-amber-500/40 rounded-full" />
            </div>
          )}
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        stats={stats}
        freqTable={freqTable}
        rawData={data}
        interpretation={interpretation}
      />

      {/* Theory Guide Modal */}
      <TheoryModal
        isOpen={isTheoryModalOpen}
        onClose={() => setIsTheoryModalOpen(false)}
      />
    </div>
  );
}
