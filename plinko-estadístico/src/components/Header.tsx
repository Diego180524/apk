import React from 'react';
import { Play, Volume2, VolumeX, BookOpen, Smartphone, Monitor } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTheory: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenTheory,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-lg border-b border-indigo-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Title and Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Play className="w-5 h-5 text-purple-400 fill-purple-400/30 transform rotate-90" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Plinko Estadístico
              </h1>
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                v2.0
              </span>
            </div>
            <p className="text-xs text-blue-200/80 font-medium">
              Simulador de Estadística Descriptiva y Distribución Binomial
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 border ${
              soundEnabled
                ? 'bg-blue-600/30 text-blue-200 border-blue-400/40 hover:bg-blue-600/50'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-300" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sonido ON' : 'Sonido OFF'}</span>
          </button>

          <button
            onClick={onToggleMobileFrame}
            className={`p-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 border ${
              isMobileFrame
                ? 'bg-purple-600/40 text-purple-200 border-purple-400/50 shadow-sm'
                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Alternar entre modo Smartphone y Pantalla Completa"
          >
            {isMobileFrame ? <Smartphone className="w-4 h-4 text-purple-300" /> : <Monitor className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMobileFrame ? 'Marco Móvil' : 'Vista Amplia'}</span>
          </button>

          <button
            onClick={onOpenTheory}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30 transition-all flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4 text-purple-200" />
            <span>Guía Teórica</span>
          </button>
        </div>
      </div>
    </header>
  );
};
