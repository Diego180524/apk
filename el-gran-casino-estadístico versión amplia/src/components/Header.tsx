import React from 'react';
import { Volume2, VolumeX, BookOpen, Smartphone, Monitor, Crown, Dices } from 'lucide-react';

interface HeaderProps {
  chips: number;
  onResetChips: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTheory: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  chips,
  onResetChips,
  soundEnabled,
  onToggleSound,
  onOpenTheory,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white shadow-2xl border-b border-amber-500/30 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Title and Casino Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Dices className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                El Gran Casino Estadístico
              </h1>
              <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 uppercase tracking-widest flex items-center space-x-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>VIP</span>
              </span>
            </div>
            <p className="text-xs text-indigo-200/90 font-medium">
              Simulador Educativo de Estadística Descriptiva & Plinko Aleatorio
            </p>
          </div>
        </div>

        {/* Header Action Buttons & Chips */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Virtual Chips Badge */}
          <div className="bg-slate-900/90 border-2 border-amber-400/60 shadow-lg shadow-amber-500/20 rounded-xl px-3 py-1.5 flex items-center space-x-2">
            <span className="text-base sm:text-lg animate-bounce">🪙</span>
            <div>
              <span className="block text-[9px] font-black uppercase text-amber-300 tracking-wider">Fichas Casino</span>
              <span className="text-sm sm:text-base font-black text-amber-300 font-mono">{chips}</span>
            </div>
            {chips <= 0 && (
              <button
                onClick={onResetChips}
                className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md hover:bg-amber-400 ml-1"
                title="Recargar 100 fichas virtuales"
              >
                +100 🪙
              </button>
            )}
          </div>

          <button
            onClick={onToggleSound}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30 shadow-md shadow-amber-950/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'Silenciar efectos de sonido del casino' : 'Activar efectos de sonido'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sonido ON' : 'Sonido OFF'}</span>
          </button>

          <button
            onClick={onToggleMobileFrame}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
              isMobileFrame
                ? 'bg-purple-600/40 text-purple-200 border-purple-400/50 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
            }`}
            title="Alternar entre modo Smartphone y Pantalla Completa"
          >
            {isMobileFrame ? <Smartphone className="w-4 h-4 text-purple-300" /> : <Monitor className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMobileFrame ? 'Marco Móvil' : 'Vista Amplia'}</span>
          </button>

          <button
            onClick={onOpenTheory}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-purple-950/40 border border-purple-400/30 transition-all flex items-center space-x-1.5 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-purple-200" />
            <span>Guía Teórica</span>
          </button>
        </div>
      </div>
    </header>
  );
};

