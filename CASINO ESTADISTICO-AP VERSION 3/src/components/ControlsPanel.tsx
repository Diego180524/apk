import React from 'react';
import { RotateCcw, Zap, Clock, Disc, Dices } from 'lucide-react';

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
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  onLaunch,
  onReset,
  isSimulating,
  totalToLaunch,
  completedCount,
  elapsedTimeMs,
  simulationSpeed,
  onChangeSpeed,
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
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-amber-500/30 text-white space-y-4">
      {/* Primary Simulation Option Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-amber-300/90 flex items-center space-x-1.5">
          <Dices className="w-4 h-4 text-amber-400" />
          <span>Seleccionar Cantidad de Pelotas a Lanzar:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[1, 5, 10, 25, 50].map((num) => (
            <button
              key={num}
              onClick={() => onLaunch(num)}
              disabled={isSimulating}
              className={`py-3 px-2 rounded-xl font-black text-xs transition-all flex flex-col items-center justify-center space-y-1 active:scale-95 border shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                totalToLaunch === num && isSimulating
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-amber-500/30'
                  : 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-amber-500/20 hover:to-amber-600/20 text-slate-100 border-slate-700 hover:border-amber-400/60'
              }`}
            >
              <span className="text-base font-black text-amber-300">{num}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-tight">
                {num === 1 ? 'Pelota' : 'Pelotas'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Control Actions (Reset & Speed) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <button
          onClick={onReset}
          disabled={isSimulating}
          className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/50 text-slate-300 border border-slate-700 transition-all flex items-center space-x-2 active:scale-95 disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar Simulación</span>
        </button>

        {/* Speed Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl text-xs font-bold border border-slate-800">
          <span className="px-2 text-slate-400 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
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
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Status Tracker & Progress Bar */}
      <div className="bg-slate-950 p-3.5 rounded-xl space-y-2.5 border border-amber-500/20 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          {/* Simulation Time */}
          <div className="flex items-center space-x-1.5 text-blue-300">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Tiempo:</span>
            <span className="font-mono font-bold text-amber-300 text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
              {formatTime(elapsedTimeMs)}
            </span>
          </div>

          {/* Current Ball Tracker */}
          <div className="flex items-center space-x-1.5 text-purple-300">
            <Disc className="w-4 h-4 text-purple-400" />
            <span>Estado:</span>
            <span className="font-mono font-bold text-amber-300 text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
              {totalToLaunch > 0
                ? `Pelota ${Math.min(completedCount + (isSimulating && completedCount < totalToLaunch ? 1 : 0), totalToLaunch)} de ${totalToLaunch}`
                : `${completedCount} pelotas`}
            </span>
          </div>

          {/* Percentage */}
          <div className="text-emerald-400 font-extrabold text-xs">
            {progressPercent}% completado
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-500 rounded-full transition-all duration-200 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

