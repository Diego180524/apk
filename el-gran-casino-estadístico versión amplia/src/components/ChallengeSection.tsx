import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Target,
  Sparkles,
  Brain,
  Search,
  HelpCircle,
  CheckCircle,
  XCircle,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  RefreshCw,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DescriptiveStats, FrequencyRow } from '../types/plinko';

interface ChallengeSectionProps {
  data: number[];
  stats: DescriptiveStats;
  freqTable: FrequencyRow[];
  isSimulating: boolean;
  onLaunch: (count: number) => void;
  resetTrigger?: number; // Allows resetting challenge score externally when Nueva Partida is clicked
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  data,
  stats,
  freqTable,
  isSimulating,
  onLaunch,
  resetTrigger,
}) => {
  // Navigation active tab inside Challenge Section
  const [activeTab, setActiveTab] = useState<'prediction' | 'detective' | 'whatif' | 'meanGoal' | 'modeGoal'>('prediction');

  // Confirmation modal state for resetting challenge points
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // 1. Prediction State
  const [prediction, setPrediction] = useState<number | null>(null);
  const [predictionEvaluated, setPredictionEvaluated] = useState<boolean>(false);
  const [isPredictionCorrect, setIsPredictionCorrect] = useState<boolean | null>(null);

  // 2. Detective de Datos State
  const [detectiveModeChoice, setDetectiveModeChoice] = useState<number | null>(null);
  const [detectiveModeFeedback, setDetectiveModeFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const [detectiveMedianChoice, setDetectiveMedianChoice] = useState<number | null>(null);
  const [detectiveMedianFeedback, setDetectiveMedianFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const [detectiveCenterChoice, setDetectiveCenterChoice] = useState<'media' | 'mediana' | 'moda' | null>(null);

  // 3. ¿Qué pasaría si...? State
  const [whatIfMeanAns, setWhatIfMeanAns] = useState<'increase' | 'decrease' | 'same' | null>(null);
  const [whatIfMedianAns, setWhatIfMedianAns] = useState<'increase' | 'decrease' | 'same' | null>(null);

  // Points tracking flags
  const [pointsSet, setPointsSet] = useState<{
    prediction: boolean;
    detectiveMode: boolean;
    detectiveMedian: boolean;
    detectiveCenter: boolean;
    whatIfMean: boolean;
    whatIfMedian: boolean;
    meanGoal: boolean;
    modeGoal: boolean;
  }>({
    prediction: false,
    detectiveMode: false,
    detectiveMedian: false,
    detectiveCenter: false,
    whatIfMean: false,
    whatIfMedian: false,
    meanGoal: false,
    modeGoal: false,
  });

  // Handler to perform score reset
  const handleResetChallengePoints = () => {
    setPointsSet({
      prediction: false,
      detectiveMode: false,
      detectiveMedian: false,
      detectiveCenter: false,
      whatIfMean: false,
      whatIfMedian: false,
      meanGoal: false,
      modeGoal: false,
    });
    setPrediction(null);
    setPredictionEvaluated(false);
    setIsPredictionCorrect(null);
    setDetectiveModeChoice(null);
    setDetectiveModeFeedback(null);
    setDetectiveMedianChoice(null);
    setDetectiveMedianFeedback(null);
    setDetectiveCenterChoice(null);
    setWhatIfMeanAns(null);
    setWhatIfMedianAns(null);
    setShowResetConfirm(false);
  };

  // Reset points when resetTrigger prop changes (e.g., from Nueva Partida)
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      handleResetChallengePoints();
    }
  }, [resetTrigger]);

  // Evaluate prediction when simulation finishes
  useEffect(() => {
    if (!isSimulating && stats.n > 0 && prediction !== null && !predictionEvaluated) {
      const actualMode = stats.mode;
      const correct = actualMode.includes(prediction);
      setIsPredictionCorrect(correct);
      setPredictionEvaluated(true);

      if (correct && !pointsSet.prediction) {
        setPointsSet((prev) => ({ ...prev, prediction: true }));
        try {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        } catch {
          // Ignore
        }
      }
    }
  }, [isSimulating, stats.n, prediction, predictionEvaluated, stats.mode, pointsSet.prediction]);

  // Check Mean Goal
  const targetMean = 4.0;
  const meanDiff = stats.n > 0 ? Math.abs(stats.mean - targetMean) : null;
  const isMeanGoalAchieved = stats.n >= 5 && meanDiff !== null && meanDiff <= 0.25;

  useEffect(() => {
    if (isMeanGoalAchieved && !pointsSet.meanGoal) {
      setPointsSet((prev) => ({ ...prev, meanGoal: true }));
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch {
        // Ignore
      }
    }
  }, [isMeanGoalAchieved, pointsSet.meanGoal]);

  // Check Mode Goal (Goal: Bin 4 is mode)
  const isModeGoalAchieved = stats.n >= 5 && stats.mode.includes(4);

  useEffect(() => {
    if (isModeGoalAchieved && !pointsSet.modeGoal) {
      setPointsSet((prev) => ({ ...prev, modeGoal: true }));
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch {
        // Ignore
      }
    }
  }, [isModeGoalAchieved, pointsSet.modeGoal]);

  // Calculate Total Score
  const totalScore =
    (pointsSet.prediction ? 10 : 0) +
    (pointsSet.detectiveMode ? 10 : 0) +
    (pointsSet.detectiveMedian ? 10 : 0) +
    (pointsSet.detectiveCenter ? 10 : 0) +
    (pointsSet.whatIfMean ? 10 : 0) +
    (pointsSet.whatIfMedian ? 10 : 0) +
    (pointsSet.meanGoal ? 20 : 0) +
    (pointsSet.modeGoal ? 20 : 0);

  // User Rank Title based on score
  const getRankInfo = (score: number) => {
    if (score >= 80) {
      return { title: '🏆 Maestro de los Datos', color: 'text-amber-400 border-amber-500/50 bg-amber-500/10' };
    }
    if (score >= 50) {
      return { title: '🧠 Analista Estadístico', color: 'text-purple-400 border-purple-500/50 bg-purple-500/10' };
    }
    if (score >= 20) {
      return { title: '📊 Aprendiz Estadístico', color: 'text-blue-400 border-blue-500/50 bg-blue-500/10' };
    }
    return { title: '🔎 Explorador de Datos', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10' };
  };

  const rank = getRankInfo(totalScore);

  // Detective Mode Handler
  const handleCheckDetectiveMode = (chosenBin: number) => {
    if (stats.n === 0) return;
    setDetectiveModeChoice(chosenBin);
    const isCorrect = stats.mode.includes(chosenBin);
    if (isCorrect) {
      setDetectiveModeFeedback({
        isCorrect: true,
        msg: `🎉 ¡Correcto! La Caja ${chosenBin} es la Moda (se repitió ${freqTable.find((f) => f.bin === chosenBin)?.absFreq || 0} veces).`,
      });
      if (!pointsSet.detectiveMode) {
        setPointsSet((prev) => ({ ...prev, detectiveMode: true }));
      }
    } else {
      setDetectiveModeFeedback({
        isCorrect: false,
        msg: `😮 Cerca, pero la Caja ${chosenBin} no es el resultado más frecuente en tus datos actuales. ¡Intenta con otra!`,
      });
    }
  };

  // Detective Median Handler
  const handleCheckDetectiveMedian = (chosenBin: number) => {
    if (stats.n === 0) return;
    setDetectiveMedianChoice(chosenBin);
    const roundedMedian = Math.round(stats.median);
    const isCorrect = chosenBin === roundedMedian;
    if (isCorrect) {
      setDetectiveMedianFeedback({
        isCorrect: true,
        msg: `🎉 ¡Acertaste! La Mediana calculada de tus datos es ${stats.median.toFixed(2)} (aproximadamente Caja ${roundedMedian}).`,
      });
      if (!pointsSet.detectiveMedian) {
        setPointsSet((prev) => ({ ...prev, detectiveMedian: true }));
      }
    } else {
      setDetectiveMedianFeedback({
        isCorrect: false,
        msg: `🧐 Revisa tus datos: la Mediana es el punto donde se divide en 50% exactamente. ¡Prueba otra opción!`,
      });
    }
  };

  // Detective Center Choice Handler
  const handleSelectCenterChoice = (type: 'media' | 'mediana' | 'moda') => {
    setDetectiveCenterChoice(type);
    if (!pointsSet.detectiveCenter) {
      setPointsSet((prev) => ({ ...prev, detectiveCenter: true }));
    }
  };

  // WhatIf Handlers
  const handleWhatIfMean = (ans: 'increase' | 'decrease' | 'same') => {
    setWhatIfMeanAns(ans);
    if (ans === 'increase' && !pointsSet.whatIfMean) {
      setPointsSet((prev) => ({ ...prev, whatIfMean: true }));
    }
  };

  const handleWhatIfMedian = (ans: 'increase' | 'decrease' | 'same') => {
    setWhatIfMedianAns(ans);
    if (ans === 'same' && !pointsSet.whatIfMedian) {
      setPointsSet((prev) => ({ ...prev, whatIfMedian: true }));
    }
  };

  return (
    <div id="desafio-estadistico" className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                Desafío Estadístico
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold uppercase">
                Interactivo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Pone a prueba tus conocimientos interactuando directamente con tus datos simulados
            </p>
          </div>
        </div>

        {/* Score & Rank Card + Reiniciar Puntos Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="text-center px-2">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Puntuación</span>
              <span className="text-xl font-black text-amber-400">{totalScore} <span className="text-xs font-bold text-slate-400">/ 100</span></span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="px-2">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Rango Actual</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${rank.color} inline-block mt-0.5`}>
                {rank.title}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="py-2 px-3 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-400 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 active:scale-95 shadow-md"
            title="Devuelve la puntuación del desafío a 0 sin borrar los datos del Plinko ni tus fichas"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>🏆 Reiniciar Puntos</span>
          </button>
        </div>
      </div>

      {/* CONFIRMATION PROMPT FOR RESETTING POINTS */}
      {showResetConfirm && (
        <div className="bg-amber-950/80 border-2 border-amber-400 p-4 rounded-xl text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">
              ¿Seguro que quieres reiniciar tus puntos a 0? (No se borrarán tus lanzamientos ni fichas).
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleResetChallengePoints}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all"
            >
              Reiniciar Puntos
            </button>
          </div>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveTab('prediction')}
          className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'prediction'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>1. Predicción</span>
        </button>

        <button
          onClick={() => setActiveTab('detective')}
          className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'detective'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>2. Detective</span>
        </button>

        <button
          onClick={() => setActiveTab('whatif')}
          className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'whatif'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>3. ¿Qué pasaría si?</span>
        </button>

        <button
          onClick={() => setActiveTab('meanGoal')}
          className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'meanGoal'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>4. Reto Media</span>
        </button>

        <button
          onClick={() => setActiveTab('modeGoal')}
          className={`col-span-2 sm:col-span-1 flex items-center justify-center space-x-1.5 p-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'modeGoal'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>5. Crea la Moda</span>
        </button>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. PREDICCIÓN */}
      {activeTab === 'prediction' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center space-x-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span>¿Qué resultado crees que aparecerá con mayor frecuencia?</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Selecciona una caja/compartimento ANTES o DURANTE tu simulación y comprueba si aciertas con la Moda real.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              +10 Puntos
            </span>
          </div>

          {/* Grid selector for Box 0 to 10 */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Elige tu caja predecida:</span>
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setPrediction(num);
                    setPredictionEvaluated(false);
                    setIsPredictionCorrect(null);
                  }}
                  className={`py-2 px-1 rounded-xl font-extrabold text-xs transition-all ${
                    prediction === num
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105 ring-2 ring-amber-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  Caja {num}
                </button>
              ))}
            </div>
          </div>

          {/* Prediction Feedback */}
          {prediction !== null && (
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-300">🎯 Tu predicción: <strong className="text-amber-400 text-base">Caja {prediction}</strong></span>
                {stats.n > 0 ? (
                  <span className="text-slate-300">📊 Resultado más frecuente (Moda): <strong className="text-purple-400 text-base">Caja {stats.mode.join(', ')}</strong></span>
                ) : (
                  <span className="text-amber-400/80 italic">Esperando que lances pelotas...</span>
                )}
              </div>

              {stats.n === 0 && (
                <div className="text-center py-2">
                  <p className="text-xs text-slate-400 mb-2">¡Haz tu lanzamiento para poner a prueba tu predicción!</p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onLaunch(10)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black shadow-md"
                    >
                      Lanzar 10 Pelotas 🎯
                    </button>
                    <button
                      onClick={() => onLaunch(25)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-black shadow-md"
                    >
                      Lanzar 25 Pelotas 🚀
                    </button>
                  </div>
                </div>
              )}

              {stats.n > 0 && isPredictionCorrect !== null && (
                <div className={`p-3 rounded-xl flex items-center space-x-3 border ${
                  isPredictionCorrect
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                }`}>
                  {isPredictionCorrect ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm">
                      {isPredictionCorrect ? '🎉 ¡Acertaste!' : 'Esta vez los datos te sorprendieron 😮'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {isPredictionCorrect
                        ? `¡Excelente intuición estadística! La Caja ${prediction} resultó ser el valor modal en tu muestra de ${stats.n} datos.`
                        : `Tu predicción fue la Caja ${prediction}, pero en esta simulación la moda real fue la Caja ${stats.mode.join(', ')}. La aleatoriedad genera variaciones en cada muestra.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. DETECTIVE DE DATOS */}
      {activeTab === 'detective' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center space-x-2">
                <Search className="w-5 h-5 text-amber-400" />
                <span>Detective de Datos 🕵️</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Inspecciona los datos realmente obtenidos en tu simulación actual para resolver estos tres acertijos:
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Hasta +30 Puntos
            </span>
          </div>

          {stats.n === 0 ? (
            <div className="text-center py-6 bg-slate-900/60 rounded-xl border border-dashed border-slate-800">
              <p className="text-sm font-bold text-amber-300 mb-2">Primero necesitas generar datos simulados</p>
              <p className="text-xs text-slate-400 mb-4">Haz un lanzamiento arriba de 10, 25 o 50 pelotas para poder resolver los retos con tus datos.</p>
              <button
                onClick={() => onLaunch(25)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg"
              >
                Lanzar 25 Pelotas Ahora
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Reto A: Encuentra la Moda */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-200 flex items-center space-x-2">
                  <span>🕵️ Reto 1: Haz clic sobre el número (caja) que crees que es la MODA en tus datos:</span>
                </h4>

                <div className="grid grid-cols-6 sm:grid-cols-11 gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleCheckDetectiveMode(num)}
                      className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                        detectiveModeChoice === num
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-105'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {detectiveModeFeedback && (
                  <p className={`text-xs p-2.5 rounded-lg font-bold border ${
                    detectiveModeFeedback.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  }`}>
                    {detectiveModeFeedback.msg}
                  </p>
                )}
              </div>

              {/* Reto B: Encuentra la Mediana */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-200 flex items-center space-x-2">
                  <span>🕵️ Reto 2: ¿Cuál es la MEDIANA de tus datos? (El centro exacto del 50%):</span>
                </h4>

                <div className="grid grid-cols-6 sm:grid-cols-11 gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleCheckDetectiveMedian(num)}
                      className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                        detectiveMedianChoice === num
                          ? 'bg-purple-500 text-white ring-2 ring-purple-300 scale-105'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {detectiveMedianFeedback && (
                  <p className={`text-xs p-2.5 rounded-lg font-bold border ${
                    detectiveMedianFeedback.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  }`}>
                    {detectiveMedianFeedback.msg}
                  </p>
                )}
              </div>

              {/* Reto C: Mejor medida de centro */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-200">
                  🕵️ Reto 3: ¿Cuál medida de tendencia central representa mejor el centro de tus datos?
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSelectCenterChoice('media')}
                    className={`p-3 rounded-xl border text-left font-bold transition-all ${
                      detectiveCenterChoice === 'media'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-xs uppercase font-black text-amber-400">Media (x̄)</span>
                    <span className="text-[11px] text-slate-300">Promedio general ponderado de la muestra</span>
                  </button>

                  <button
                    onClick={() => handleSelectCenterChoice('mediana')}
                    className={`p-3 rounded-xl border text-left font-bold transition-all ${
                      detectiveCenterChoice === 'mediana'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300 ring-1 ring-purple-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-xs uppercase font-black text-purple-400">Mediana (Me)</span>
                    <span className="text-[11px] text-slate-300">Punto medio que divide exactamente el 50%</span>
                  </button>

                  <button
                    onClick={() => handleSelectCenterChoice('moda')}
                    className={`p-3 rounded-xl border text-left font-bold transition-all ${
                      detectiveCenterChoice === 'moda'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300 ring-1 ring-blue-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-xs uppercase font-black text-blue-400">Moda (Mo)</span>
                    <span className="text-[11px] text-slate-300">El compartimento más popular o repetido</span>
                  </button>
                </div>

                {detectiveCenterChoice && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-extrabold text-amber-300">💡 Explicación del Detective:</p>
                    {detectiveCenterChoice === 'media' && (
                      <p>
                        La <strong>Media</strong> (x̄ = {stats.mean.toFixed(2)}) es perfecta cuando los datos son simétricos, ya que aprovecha cada valor numérico individual.
                      </p>
                    )}
                    {detectiveCenterChoice === 'mediana' && (
                      <p>
                        La <strong>Mediana</strong> (Me = {stats.median.toFixed(2)}) es el mejor indicador cuando hay valores extremos o sesgos, porque no se altera por datos atípicos aislados.
                      </p>
                    )}
                    {detectiveCenterChoice === 'moda' && (
                      <p>
                        La <strong>Moda</strong> (Mo = Caja {stats.mode.join(', ')}) muestra la concentración pico o categoría preferida por la mayoría de las pelotas.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ¿QUÉ PASARÍA SI...? */}
      {activeTab === 'whatif' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>¿Qué pasaría si...? 🤔</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pensa en cómo reaccionan la Media y la Mediana frente a cambios extremos en tus datos.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              +20 Puntos
            </span>
          </div>

          {/* Situation 1 */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-200">
              1. Imagina que agregamos un resultado muy alto (ejemplo: Caja 10) a tus datos. ¿Qué crees que pasaría con la MEDIA?
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleWhatIfMean('increase')}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                  whatIfMeanAns === 'increase'
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <ArrowUp className="w-4 h-4 text-emerald-400" />
                <span>⬆️ Aumentaría</span>
              </button>

              <button
                onClick={() => handleWhatIfMean('decrease')}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                  whatIfMeanAns === 'decrease'
                    ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <ArrowDown className="w-4 h-4 text-rose-400" />
                <span>⬇️ Disminuiría</span>
              </button>

              <button
                onClick={() => handleWhatIfMean('same')}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                  whatIfMeanAns === 'same'
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <span>➡️ Casi no cambiaría</span>
              </button>
            </div>

            {whatIfMeanAns && (
              <div className={`p-3 rounded-xl text-xs border ${
                whatIfMeanAns === 'increase'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
              }`}>
                {whatIfMeanAns === 'increase' ? (
                  <p className="font-bold">
                    🎉 ¡Correcto! La <strong>Media</strong> se calcula sumando todos los valores de la muestra. Si se añade un valor extremadamente alto, la suma total se eleva y desplaza la media hacia arriba.
                  </p>
                ) : (
                  <p className="font-bold">
                    💡 ¡Inténtalo de nuevo! Recuerda que para calcular la media sumamos todos los datos; si agregamos un valor muy grande, la suma aumenta.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Situation 2 */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-200">
              2. ¿Y qué crees que pasaría con la MEDIANA si agregamos ese mismo resultado alto?
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleWhatIfMedian('increase')}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                  whatIfMedianAns === 'increase'
                    ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <ArrowUp className="w-4 h-4 text-rose-400" />
                <span>⬆️ Aumentaría mucho</span>
              </button>

              <button
                onClick={() => handleWhatIfMedian('decrease')}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                  whatIfMedianAns === 'decrease'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <ArrowDown className="w-4 h-4 text-amber-400" />
                <span>⬇️ Disminuiría</span>
              </button>

              <button
                onClick={() => handleWhatIfMedian('same')}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                  whatIfMedianAns === 'same'
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <span>➡️ Casi no cambiaría</span>
              </button>
            </div>

            {whatIfMedianAns && (
              <div className={`p-3 rounded-xl text-xs border ${
                whatIfMedianAns === 'same'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
              }`}>
                {whatIfMedianAns === 'same' ? (
                  <p className="font-bold">
                    🎉 ¡Brillante! La <strong>Mediana</strong> es resistente a valores atípicos o extremos (outliers). Solo le importa la posición de orden central (el dato que está a la mitad), por lo que casi no se ve afectada.
                  </p>
                ) : (
                  <p className="font-bold">
                    💡 Piensa en el ordenamiento: la mediana busca únicamente el elemento que queda justo en el centro del 50%.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. RETO DE LA MEDIA */}
      {activeTab === 'meanGoal' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Reto de la Media 🎯</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Realiza lanzamientos y observa en tiempo real cómo cambia la media acumulada de tus datos.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              +20 Puntos
            </span>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 text-center">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 inline-block">
              🎯 OBJETIVO: Conseguir una media cercana a 4.00
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Media Actual</span>
                <span className="text-xl font-black text-amber-300">
                  {stats.n > 0 ? stats.mean.toFixed(2) : '---'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Objetivo</span>
                <span className="text-xl font-black text-emerald-400">4.00</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Distancia al Objetivo</span>
                <span className="text-xl font-black text-purple-400">
                  {meanDiff !== null ? meanDiff.toFixed(2) : '---'}
                </span>
              </div>
            </div>

            {isMeanGoalAchieved ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-xs sm:text-sm font-bold space-y-1">
                <p className="text-base font-black">🏆 ¡Muy Cerca! ¡Objetivo Cumplido!</p>
                <p>
                  Objetivo: <strong>4.00</strong> | Tu Media Actual: <strong>{stats.mean.toFixed(2)}</strong> | Diferencia: <strong>{meanDiff?.toFixed(2)}</strong>
                </p>
                <p className="text-xs opacity-90 font-normal">
                  ¡Has demostrado cómo la media muestral responde a la acumulación de datos aleatorios!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  {stats.n === 0
                    ? 'Inicia lanzando pelotas para ajustar la media hacia el objetivo.'
                    : `Llevas ${stats.n} pelotas lanzadas. Lanza más pelotas para modificar la media.`}
                </p>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onLaunch(5)}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md"
                  >
                    +5 Pelotas 🎯
                  </button>
                  <button
                    onClick={() => onLaunch(10)}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md"
                  >
                    +10 Pelotas 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. CONSTRUYE LA MODA */}
      {activeTab === 'modeGoal' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Construye la Moda 🏗️</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Comprende la moda observando la frecuencia acumulada en cada compartimento.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              +20 Puntos
            </span>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="text-center">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 inline-block">
                🎯 RETO: Haz que la CAJA 4 sea la MODA
              </span>
            </div>

            {/* Visual Frequency Bars */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold block mb-1">Frecuencia por compartimento:</span>
              {[1, 2, 3, 4, 5, 6, 7].map((b) => {
                const count = freqTable.find((f) => f.bin === b)?.absFreq || 0;
                const maxCount = Math.max(1, ...freqTable.map((f) => f.absFreq));
                const isTarget = b === 4;

                return (
                  <div key={b} className="flex items-center space-x-3">
                    <span className={`w-12 font-bold ${isTarget ? 'text-amber-400' : 'text-slate-400'}`}>
                      Caja {b} {isTarget ? '⭐' : ''}
                    </span>
                    <div className="flex-1 bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isTarget ? 'bg-amber-400' : 'bg-purple-500/80'
                        }`}
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono font-extrabold text-slate-200">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {isModeGoalAchieved ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-xs sm:text-sm font-bold text-center space-y-1">
                <p className="text-base font-black">🎉 ¡Lo lograste!</p>
                <p>El número 4 es la Moda de tu conjunto de datos.</p>
                <p className="text-xs opacity-90 font-normal">
                  Has comprendido que la Moda es simplemente la categoría o compartimento con mayor número absoluto de repeticiones.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-xs text-slate-300">
                  {stats.n === 0
                    ? 'Lanza pelotas para comenzar a acumular frecuencias.'
                    : `Moda actual: Caja ${stats.mode.join(', ')}. Lanza más pelotas para intentar situar la moda en la Caja 4.`}
                </p>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onLaunch(10)}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md"
                  >
                    Lanzar 10 Pelotas 🎯
                  </button>
                  <button
                    onClick={() => onLaunch(25)}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md"
                  >
                    Lanzar 25 Pelotas 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
