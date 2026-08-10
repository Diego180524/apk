/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { PlinkoCanvas } from './components/PlinkoCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { CasinoPanel, ALL_SURPRISE_CARDS, SurpriseCard } from './components/CasinoPanel';
import { RoundResultCard } from './components/RoundResultCard';
import { InteractiveExplanations } from './components/InteractiveExplanations';
import { StatsCards } from './components/StatsCards';
import { FrequencyTable } from './components/FrequencyTable';
import { ChartsSection } from './components/ChartsSection';
import { InterpretationCard } from './components/InterpretationCard';
import { ChallengeSection } from './components/ChallengeSection';
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

  // Casino Virtual Chips & Betting state
  const [chips, setChips] = useState<number>(100);
  const [betAmount, setBetAmount] = useState<number>(20);
  const [predictedBin, setPredictedBin] = useState<number | null>(5);
  const [predictedMeanDir, setPredictedMeanDir] = useState<'greater' | 'lesser' | 'similar' | null>('similar');
  
  // Surprise Card System State
  const [activeSurpriseCard, setActiveSurpriseCard] = useState<SurpriseCard>(ALL_SURPRISE_CARDS[0]);
  const [isCardRevealed, setIsCardRevealed] = useState<boolean>(false);
  const [isJokerUsed, setIsJokerUsed] = useState<boolean>(false);

  // Round Results Tracking
  const [lastBet, setLastBet] = useState<number>(20);
  const [lastReward, setLastReward] = useState<number>(0);
  const [lastPredictionBin, setLastPredictionBin] = useState<number | null>(null);
  const [lastPredictionMeanDir, setLastPredictionMeanDir] = useState<'greater' | 'lesser' | 'similar' | null>(null);
  const [lastSurpriseCardTitle, setLastSurpriseCardTitle] = useState<string | null>(null);

  // Simulation controls state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [totalToLaunch, setTotalToLaunch] = useState<number>(0);
  const [launchedCount, setLaunchedCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [simulationSpeed, setSimulationSpeed] = useState<'normal' | 'fast' | 'turbo' | 'instant'>('normal');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Timer state
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Layout / Frame toggle
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Challenge score reset trigger for Nueva Partida
  const [challengeResetTrigger, setChallengeResetTrigger] = useState<number>(0);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState<boolean>(false);

  // Calculated Statistics & Frequency Table Memoized
  const stats = useMemo(() => calculateDescriptiveStats(data), [data]);
  const freqTable = useMemo(() => calculateFrequencyTable(data, 0.5, 10), [data]);
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

  // Draw random surprise card & reset card states
  const handleDrawSurpriseCard = () => {
    if (isSimulating) return;
    const randomIndex = Math.floor(Math.random() * ALL_SURPRISE_CARDS.length);
    setActiveSurpriseCard(ALL_SURPRISE_CARDS[randomIndex]);
    setIsCardRevealed(false);
    setIsJokerUsed(false);
  };

  // Reveal card handler
  const handleRevealCard = () => {
    setIsCardRevealed(true);

    // If card is instant reward, apply chip bonus directly upon reveal
    if (activeSurpriseCard.id === 'r1') {
      setChips((prev) => prev + 15);
    } else if (activeSurpriseCard.id === 'r2') {
      setChips((prev) => prev + 10);
    }
  };

  // Use Joker handler
  const handleUseJoker = () => {
    setIsJokerUsed(true);
  };

  // 1. REINICIAR FICHAS (Solo restablece las fichas a 100 y limpia apuestas, MANTENIENDO el Plinko y las estadísticas)
  const handleResetChips = () => {
    if (isSimulating) return;
    setChips(100);
    setBetAmount(20);
    setPredictedBin(null);
    setPredictedMeanDir(null);
  };

  // 2. NUEVA PARTIDA (Reinicia toda la experiencia de gamificación y simulación)
  const handleNewGame = () => {
    if (isSimulating) return;
    setChips(100);
    setBetAmount(20);
    setPredictedBin(5);
    setPredictedMeanDir('similar');
    setLastBet(20);
    setLastReward(0);
    setLastPredictionBin(null);
    setLastPredictionMeanDir(null);
    setLastSurpriseCardTitle(null);

    // Reset card state and draw fresh random card
    const randomIndex = Math.floor(Math.random() * ALL_SURPRISE_CARDS.length);
    setActiveSurpriseCard(ALL_SURPRISE_CARDS[randomIndex]);
    setIsCardRevealed(false);
    setIsJokerUsed(false);

    // Reset Challenge score
    setChallengeResetTrigger((prev) => prev + 1);

    // Reset Plinko simulation
    landedBufferRef.current = [];
    setIsSimulating(false);
    setData([]);
    setTotalToLaunch(0);
    setLaunchedCount(0);
    setCompletedCount(0);
    setElapsedTimeMs(0);
  };

  // Launch handler ("Lanzar 1 pelota", "Lanzar 5 pelotas", "Lanzar 10 pelotas", "Lanzar 25 pelotas", "Lanzar 50 pelotas")
  const handleLaunch = (count: number) => {
    if (isSimulating) return;

    // Lock prediction values for evaluation
    setLastBet(betAmount);
    setLastPredictionBin(predictedBin);
    setLastPredictionMeanDir(predictedMeanDir);
    setLastSurpriseCardTitle(activeSurpriseCard ? activeSurpriseCard.title : null);

    landedBufferRef.current = [];
    setData([]);
    setTotalToLaunch(count);
    setLaunchedCount(0);
    setCompletedCount(0);
    setElapsedTimeMs(0);
    setIsSimulating(true);
  };

  // Ball landed callback
  const handleBallLanded = useCallback((binIndex: number) => {
    landedBufferRef.current.push(binIndex);
    setCompletedCount((prev) => prev + 1);
    setLaunchedCount((prev) => prev + 1);
  }, []);

  // Batch finish callback (calculates stats and updates charts ONLY ONCE when simulation finishes)
  const handleBatchFinished = useCallback(() => {
    setIsSimulating(false);
    const finalData = [...landedBufferRef.current];
    setData(finalData);

    const roundStats = calculateDescriptiveStats(finalData);

    let isModeHit = false;
    if (predictedBin !== null && roundStats.mode.includes(predictedBin)) {
      isModeHit = true;
    }

    let actualMeanDir: 'greater' | 'lesser' | 'similar' = 'similar';
    if (roundStats.mean > 5.2) actualMeanDir = 'greater';
    else if (roundStats.mean < 4.8) actualMeanDir = 'lesser';

    let isMeanHit = false;
    if (predictedMeanDir !== null && predictedMeanDir === actualMeanDir) {
      isMeanHit = true;
    }

    // Evaluate Card bonus based on category & card type
    let cardBonus = 0;
    let isShieldActive = false;
    let isDoubleMultiplier = false;

    if (activeSurpriseCard && isCardRevealed) {
      if (activeSurpriseCard.id === 'j2') isShieldActive = true; // Escudo Estadístico
      if (activeSurpriseCard.id === 'j3') isDoubleMultiplier = true; // Doble Recompensa

      if (activeSurpriseCard.category === 'joker' || activeSurpriseCard.isJoker) {
        cardBonus = isJokerUsed ? 25 : 10;
      } else if (activeSurpriseCard.category === 'reward') {
        cardBonus = 20;
      } else if (activeSurpriseCard.category === 'challenge') {
        if (isModeHit || isMeanHit) cardBonus = 25;
      } else if (activeSurpriseCard.category === 'trap') {
        if (activeSurpriseCard.id === 't2' && (isModeHit || isMeanHit)) cardBonus = 35; // Apuesta arriesgada
      }
    }

    if (isModeHit || isMeanHit || cardBonus > 0) {
      let reward = 20 + (isModeHit && isMeanHit ? 10 : 0) + cardBonus;
      if (isDoubleMultiplier) reward *= 2;
      setChips((prev) => prev + reward);
      setLastReward(reward);
    } else {
      let loss = 10;
      if (activeSurpriseCard?.id === 't2') loss = 15; // Apuesta arriesgada
      if (isShieldActive) loss = 0; // Escudo evita pérdida

      setChips((prev) => Math.max(0, prev - loss));
      setLastReward(-loss);
    }

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
  }, [predictedBin, predictedMeanDir, activeSurpriseCard, isCardRevealed, isJokerUsed]);

  // Standard simulation reset handler (keeps chips intact, clears board)
  const handleReset = () => {
    landedBufferRef.current = [];
    setIsSimulating(false);
    setData([]);
    setTotalToLaunch(0);
    setLaunchedCount(0);
    setCompletedCount(0);
    setElapsedTimeMs(0);

    const randomIndex = Math.floor(Math.random() * ALL_SURPRISE_CARDS.length);
    setActiveSurpriseCard(ALL_SURPRISE_CARDS[randomIndex]);
    setIsCardRevealed(false);
    setIsJokerUsed(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 pb-12">
      {/* Header Bar */}
      <Header
        chips={chips}
        onResetChips={handleResetChips}
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
            {/* Upper Grid: Plinko Canvas (Left) & Casino Panel + Launch Controls (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Plinko Simulator Board */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block shadow-sm shadow-amber-400/50" />
                    <span>Tablero Plinko en Cuadrícula (10 Niveles)</span>
                  </h2>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-400/30 shadow-md">
                    Cuadrícula Aleatoria
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
                  soundEnabled={soundEnabled}
                />
              </div>

              {/* Casino Betting & Predictions + Controls Panel */}
              <div className="lg:col-span-5 space-y-4">
                {/* Casino Prediction & Betting Panel */}
                <CasinoPanel
                  chips={chips}
                  betAmount={betAmount}
                  onSelectBet={setBetAmount}
                  predictedBin={predictedBin}
                  onSelectPredictedBin={setPredictedBin}
                  predictedMeanDir={predictedMeanDir}
                  onSelectPredictedMeanDir={setPredictedMeanDir}
                  activeSurpriseCard={activeSurpriseCard}
                  isCardRevealed={isCardRevealed}
                  onRevealCard={handleRevealCard}
                  isJokerUsed={isJokerUsed}
                  onUseJoker={handleUseJoker}
                  onDrawSurpriseCard={handleDrawSurpriseCard}
                  isSimulating={isSimulating}
                  onResetChips={handleResetChips}
                  onNewGame={handleNewGame}
                />

                {/* Launch Options (1, 5, 10, 25, 50) & Simulation Speed Controls */}
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
                />
              </div>
            </div>

            {/* Round Result & Evaluation Card (DESCUBRIR RESULTADO) */}
            <RoundResultCard
              stats={stats}
              chips={chips}
              lastBet={lastBet}
              lastReward={lastReward}
              lastPredictionBin={lastPredictionBin}
              lastPredictionMeanDir={lastPredictionMeanDir}
              activeSurpriseCardTitle={lastSurpriseCardTitle}
            />

            {/* Interactive Student Challenge Section (DESAFÍO ESTADÍSTICO) */}
            <ChallengeSection
              data={data}
              stats={stats}
              freqTable={freqTable}
              isSimulating={isSimulating}
              onLaunch={handleLaunch}
              resetTrigger={challengeResetTrigger}
            />

            {/* Interactive D3/Recharts Visualization Charts */}
            <ChartsSection freqTable={freqTable} n={stats.n} />

            {/* Complete Frequency Distribution Table (Fi, hi, Fi%, Hi%) */}
            <FrequencyTable freqTable={freqTable} n={stats.n} />

            {/* Descriptive Statistics Metric Cards */}
            <StatsCards stats={stats} />

            {/* Automatic Natural Language Statistical Interpretation Card */}
            <InterpretationCard
              interpretation={interpretation}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              n={stats.n}
            />

            {/* Educational Step-by-Step Statistical Explanations & Concepts */}
            <InteractiveExplanations stats={stats} freqTable={freqTable} />
          </div>
        </div>
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        stats={stats}
        freqTable={freqTable}
      />

      <TheoryModal
        isOpen={isTheoryModalOpen}
        onClose={() => setIsTheoryModalOpen(false)}
      />
    </div>
  );
}
