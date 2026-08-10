import React from 'react';
import { Award, Trophy, Sparkles, CheckCircle2, AlertCircle, Coins, Flame } from 'lucide-react';
import { DescriptiveStats } from '../types/plinko';

interface RoundResultCardProps {
  stats: DescriptiveStats;
  chips: number;
  lastBet: number;
  lastReward: number;
  lastPredictionBin: number | null;
  lastPredictionMeanDir: 'greater' | 'lesser' | 'similar' | null;
  activeSurpriseCardTitle: string | null;
  onReset: () => void;
}

export const RoundResultCard: React.FC<RoundResultCardProps> = ({
  stats,
  chips,
  lastBet,
  lastReward,
  lastPredictionBin,
  lastPredictionMeanDir,
  activeSurpriseCardTitle,
}) => {
  if (stats.n === 0) return null;

  const isWin = lastReward > 0;

  // Determine Statistical Master Level
  let levelTitle = '🔎 Explorador Estadístico';
  let levelColor = 'text-blue-300 border-blue-500/40 bg-blue-950/30';

  if (chips >= 220) {
    levelTitle = '🎰 Maestro del Casino Estadístico';
    levelColor = 'text-amber-300 border-amber-400/60 bg-amber-950/50 shadow-amber-500/20';
  } else if (chips >= 150) {
    levelTitle = '🧠 Analista Estadístico VIP';
    levelColor = 'text-purple-300 border-purple-400/50 bg-purple-950/40';
  } else if (chips >= 100) {
    levelTitle = '📊 Jugador Estadístico Pro';
    levelColor = 'text-emerald-300 border-emerald-400/40 bg-emerald-950/30';
  }

  // Calculate actual mean direction vs 5.0
  let actualMeanDir: 'greater' | 'lesser' | 'similar' = 'similar';
  if (stats.mean > 5.2) actualMeanDir = 'greater';
  else if (stats.mean < 4.8) actualMeanDir = 'lesser';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-amber-500/50 text-white space-y-5 animate-fadeIn">
      {/* Top Title Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-amber-300 uppercase tracking-tight flex items-center space-x-2">
              <span>🎰 RESULTADO DE TU PARTIDA</span>
            </h2>
            <p className="text-xs text-indigo-200">
              Evaluación de predicción y actualización de fichas
            </p>
          </div>
        </div>

        {/* Level Rank Badge */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md ${levelColor}`}>
          <Award className="w-4 h-4 text-amber-400" />
          <span>{levelTitle}</span>
        </div>
      </div>

      {/* Main Grid: Prediction Result & Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prediction Feedback Box */}
        <div className={`p-4 rounded-xl border space-y-2.5 ${
          isWin
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
            : 'bg-slate-950 border-amber-500/30 text-amber-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider flex items-center space-x-1.5">
              {isWin ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>🎯 Evaluación de Predicción</span>
            </span>

            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
              isWin
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
            }`}>
              {isWin ? '🎉 ¡ACERTASTE!' : '😮 La estadística te sorprendió'}
            </span>
          </div>

          <div className="text-xs space-y-1 font-medium text-slate-200">
            {lastPredictionBin !== null && (
              <p>
                <span className="text-slate-400">Tu predicción de Moda:</span>{' '}
                <strong className="text-amber-300 font-mono">Caja {lastPredictionBin}</strong>{' '}
                │ <span className="text-slate-400">Moda real:</span>{' '}
                <strong className="text-emerald-300 font-mono">Caja {stats.mode.join(', ')}</strong>
              </p>
            )}

            {lastPredictionMeanDir !== null && (
              <p>
                <span className="text-slate-400">Tu predicción de Media:</span>{' '}
                <strong className="text-amber-300 font-mono">
                  {lastPredictionMeanDir === 'greater' ? 'Mayor (>5.0)' : lastPredictionMeanDir === 'lesser' ? 'Menor (<5.0)' : 'Parecida (~5.0)'}
                </strong>{' '}
                │ <span className="text-slate-400">Media real:</span>{' '}
                <strong className="text-emerald-300 font-mono">{stats.mean.toFixed(2)}</strong>
              </p>
            )}

            {activeSurpriseCardTitle && (
              <p className="text-[11px] text-indigo-300 pt-1">
                🃏 Carta jugada: <strong>{activeSurpriseCardTitle}</strong>
              </p>
            )}

            <p className="text-xs italic pt-1 text-slate-300">
              {isWin
                ? '¡Excelente intuición probabilística! La distribución binomial convergió según lo previsto.'
                : 'Los eventos aleatorios individuales varían. Al realizar más lanzamientos, la ley de los grandes números estabilizará los datos.'}
            </p>
          </div>
        </div>

        {/* Chips Balance Summary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
          <h3 className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center space-x-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span> Balance de Fichas de la Ronda</span>
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Apuestado</span>
              <span className="text-sm font-black text-amber-400 font-mono">🪙 {lastBet}</span>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Resultado</span>
              <span className={`text-sm font-black font-mono ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                {lastReward >= 0 ? `+${lastReward}` : `${lastReward}`} 🪙
              </span>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-amber-500/40">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Total Fichas</span>
              <span className="text-base font-black text-amber-300 font-mono">🪙 {chips}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Statistics Overview */}
      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-indigo-500/30">
        <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-2">
          📊 TUS ESTADÍSTICAS RÁPIDAS
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center font-medium">
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Media (μ)</span>
            <span className="font-bold text-amber-300 text-sm font-mono">{stats.mean.toFixed(2)}</span>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Mediana (Me)</span>
            <span className="font-bold text-emerald-300 text-sm font-mono">{stats.median.toFixed(2)}</span>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Moda (Mo)</span>
            <span className="font-bold text-purple-300 text-sm font-mono">Caja {stats.mode.join(', ')}</span>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Lanzamientos (n)</span>
            <span className="font-bold text-blue-300 text-sm font-mono">{stats.n} pelotas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
