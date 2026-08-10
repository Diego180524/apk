import React from 'react';
import {
  Sparkles,
  Target,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Coins,
  ShieldAlert,
  RotateCcw,
  Play
} from 'lucide-react';
import { SurpriseCardView, SurpriseCard, ALL_SURPRISE_CARDS } from './SurpriseCardView';

export { ALL_SURPRISE_CARDS };
export type { SurpriseCard };

interface CasinoPanelProps {
  chips: number;
  betAmount: number;
  onSelectBet: (amount: number) => void;
  predictedBin: number | null;
  onSelectPredictedBin: (bin: number | null) => void;
  predictedMeanDir: 'greater' | 'lesser' | 'similar' | null;
  onSelectPredictedMeanDir: (dir: 'greater' | 'lesser' | 'similar' | null) => void;
  activeSurpriseCard: SurpriseCard;
  isCardRevealed: boolean;
  onRevealCard: () => void;
  isJokerUsed: boolean;
  onUseJoker: () => void;
  onDrawSurpriseCard: () => void;
  isSimulating: boolean;
  onResetChips: () => void;
  onNewGame: () => void;
}

export const CasinoPanel: React.FC<CasinoPanelProps> = ({
  chips,
  betAmount,
  onSelectBet,
  predictedBin,
  onSelectPredictedBin,
  predictedMeanDir,
  onSelectPredictedMeanDir,
  activeSurpriseCard,
  isCardRevealed,
  onRevealCard,
  isJokerUsed,
  onUseJoker,
  onDrawSurpriseCard,
  isSimulating,
  onResetChips,
  onNewGame,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-amber-500/40 text-white space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/20 pb-3 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl text-slate-950 font-black shadow-md shadow-amber-500/20">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center space-x-1">
              <span>Zona de Apuestas & Predicción</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Toma tus decisiones ANTES de lanzar las pelotas
            </p>
          </div>
        </div>

        {/* Action Controls for Chips and New Game */}
        <div className="flex items-center space-x-2">
          {/* REINICIAR FICHAS ONLY BUTTON */}
          <button
            onClick={onResetChips}
            disabled={isSimulating}
            className="py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider transition-all flex items-center space-x-1 active:scale-95 disabled:opacity-50"
            title="Volver el saldo de fichas a 100 sin borrar lanzamientos ni estadísticas"
          >
            <span>🪙 Reiniciar Fichas (100)</span>
          </button>

          {/* NUEVA PARTIDA BUTTON */}
          <button
            onClick={onNewGame}
            disabled={isSimulating}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-all shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center space-x-1"
            title="Reiniciar toda la experiencia de juego, cartas, puntos, predicciones y simulación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>🔄 Nueva Partida</span>
          </button>
        </div>
      </div>

      {/* 1. BET AMOUNT SELECTION */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-amber-300/90 flex items-center space-x-1.5">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>1. Selecciona la cantidad de fichas a apostar:</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[10, 20, 30].map((amount) => (
            <button
              key={amount}
              onClick={() => onSelectBet(amount)}
              disabled={isSimulating || chips < amount}
              className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1.5 border active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                betAmount === amount
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-slate-800'
              }`}
            >
              <span>🪙</span>
              <span>Apostar {amount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. PREDICTION: MOST FREQUENT BIN (MODA) */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-amber-300/90 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>2. ¿Qué caja/número crees que aparecerá más veces?</span>
          </span>
          {predictedBin !== null && (
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Elegida: Caja {predictedBin}
            </span>
          )}
        </label>

        <div className="grid grid-cols-6 sm:grid-cols-11 gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => onSelectPredictedBin(predictedBin === num ? null : num)}
              disabled={isSimulating}
              className={`py-2 rounded-xl text-xs font-black transition-all border disabled:opacity-50 ${
                predictedBin === num
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 shadow-md scale-105'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PREDICTION: MEAN DIRECTION */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-amber-300/90 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3. ¿Crees que la Media de esta simulación será...?</span>
        </label>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onSelectPredictedMeanDir(predictedMeanDir === 'greater' ? null : 'greater')}
            disabled={isSimulating}
            className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 border transition-all ${
              predictedMeanDir === 'greater'
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-2 ring-emerald-400 font-black'
                : 'bg-slate-950 hover:bg-slate-800 text-emerald-300 border-slate-800'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Mayor (&gt;5.0)</span>
          </button>

          <button
            onClick={() => onSelectPredictedMeanDir(predictedMeanDir === 'similar' ? null : 'similar')}
            disabled={isSimulating}
            className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 border transition-all ${
              predictedMeanDir === 'similar'
                ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 font-black'
                : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-slate-800'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Parecida (~5.0)</span>
          </button>

          <button
            onClick={() => onSelectPredictedMeanDir(predictedMeanDir === 'lesser' ? null : 'lesser')}
            disabled={isSimulating}
            className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 border transition-all ${
              predictedMeanDir === 'lesser'
                ? 'bg-rose-500 text-white border-rose-300 ring-2 ring-rose-400 font-black'
                : 'bg-slate-950 hover:bg-slate-800 text-rose-300 border-slate-800'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Menor (&lt;5.0)</span>
          </button>
        </div>
      </div>

      {/* 4. SURPRISE CASINO PLAYING CARD SECTION */}
      <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-amber-300 flex items-center space-x-1.5">
            <span className="text-base">🃏</span>
            <span>Mazo de Cartas de Casino Educativo</span>
          </span>

          <button
            onClick={onDrawSurpriseCard}
            disabled={isSimulating}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shadow-sm active:scale-95 transition-all"
          >
            🎴 Barajar Nuevamente
          </button>
        </div>

        {/* 3D Flip Card Component */}
        <SurpriseCardView
          card={activeSurpriseCard}
          isRevealed={isCardRevealed}
          onRevealCard={onRevealCard}
          isJokerUsed={isJokerUsed}
          onUseJoker={onUseJoker}
          isSimulating={isSimulating}
          onDrawNewCard={onDrawSurpriseCard}
        />
      </div>

      {/* Footer Educational Disclaimer */}
      <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Fichas educativas sin valor monetario. Diseñado exclusivamente para aprendizaje estadístico.</span>
      </div>
    </div>
  );
};
