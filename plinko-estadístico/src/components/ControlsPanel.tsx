import React from 'react';
import { Play, FastForward, RotateCcw, Zap, Clock, Disc, Layers } from 'lucide-react';

interface ControlsPanelProps {
  onLaunch: (count: number) => void;
  onReset: () => void;
  isSimulating: boolean;
  launchedCount: number;
  totalToLaunch: number;
  completedCount: number;
  elapsedTimeMs: number;
  simulationSpeed: 'normal' | 'fast' | 'turbo' | 'instant';
  onChangeSpeed: (speed: 'normal' | 'fast' | 'turbo' | 'instant') => void;
  probabilityP: number;
  onChangeP: (p: number) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  onLaunch,
  onReset,
  isSimulating,
  launchedCount,
  totalToLaunch,
  completedCount,
  elapsedTimeMs,
  simulationSpeed,
  onChangeSpeed,
  probabilityP,
  onChangeP,
}) => {
  // Format elapsed time MM:SS.S
  const formatTime = (ms: number) => {
    const totalSec = ms / 1000;
    const mins = Math.floor(totalSec / 60);
    const secs = (totalSec % 60).toFixed(1);
    return `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}s`;
  };

  const progressPercent =
    totalToLaunch > 0 ? Math.min(100, Math.round((completedCount / totalToLaunch) * 100)) : 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 space-y-4">
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onLaunch(1)}
          disabled={isSimulating}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Lanzar 1 pelota</span>
        </button>

        <button
          onClick={() => onLaunch(50)}
          disabled={isSimulating}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 active:scale-[0.98] text-white shadow-md shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          <FastForward className="w-4 h-4 fill-current" />
          <span>Lanzar 50 pelotas</span>
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 border border-slate-300 transition-all flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar simulación</span>
        </button>
      </div>

      {/* Secondary Quick Batch & Speed Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Custom counts */}
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
          <span className="text-slate-400 hidden md:inline">Otros lanzamientos:</span>
          {[10, 100, 500].map((num) => (
            <button
              key={num}
              onClick={() => onLaunch(num)}
              disabled={isSimulating}
              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border border-blue-200 disabled:opacity-50 transition-all"
            >
              +{num}
            </button>
          ))}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
          <span className="px-2 text-slate-500 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Velocidad:</span>
          </span>
          {(
            [
              { id: 'normal', label: '1x' },
              { id: 'fast', label: '3x' },
              { id: 'turbo', label: '10x' },
              { id: 'instant', label: '0s' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => onChangeSpeed(s.id)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                simulationSpeed === s.id
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Probability Bias Control Slider (Optional Educational Tool) */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Probabilidad p (Izquierda / Derecha en cada clavija):</span>
          <span className="bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-md">
            p = {probabilityP.toFixed(2)} {probabilityP === 0.5 ? '(Simétrico B(10, 0.5))' : probabilityP < 0.5 ? '(Sesgo Izq)' : '(Sesgo Der)'}
          </span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-48">
          <span className="text-[10px] text-slate-400 font-bold">0.1</span>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={probabilityP}
            onChange={(e) => onChangeP(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <span className="text-[10px] text-slate-400 font-bold">0.9</span>
        </div>
      </div>

      {/* Real-time Status Tracker & Progress Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3.5 rounded-xl space-y-2.5 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
          {/* Simulation Time */}
          <div className="flex items-center space-x-1.5 text-blue-300">
            <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>Tiempo:</span>
            <span className="font-mono font-bold text-white text-sm bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {formatTime(elapsedTimeMs)}
            </span>
          </div>

          {/* Current Ball Tracker */}
          <div className="flex items-center space-x-1.5 text-purple-300">
            <Disc className="w-4 h-4 text-purple-400" />
            <span>Pelota actual:</span>
            <span className="font-mono font-bold text-white text-sm bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {totalToLaunch > 0
                ? `${completedCount} de ${totalToLaunch}`
                : `${completedCount} acumuladas`}
            </span>
          </div>

          {/* Percentage */}
          <div className="text-emerald-400 font-extrabold text-xs">
            {progressPercent}% completado
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-200 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
