import React from 'react';
import { Compass, Database, RotateCcw } from 'lucide-react';
import { GameScene } from '../types';

interface HeaderHUDProps {
  currentScene: GameScene;
  totalDataCount: number;
  onRestart: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({ currentScene, totalDataCount, onRestart }) => {
  const getSceneTitle = () => {
    switch (currentScene) {
      case 'MISSION_1_MALECON':
        return '🌆 Misión 1: Malecón 2000';
      case 'MISSION_2_RUTA':
        return '🚌 Misión 2: Ruta Guayaquil';
      case 'MISSION_3_PARQUE':
        return '🦎 Misión 3: Parque Seminario';
      case 'TRANSITION_GATHERING':
        return '✨ Datos Recopilados';
      case 'EXPLANATION_DESCRIPTIVE':
        return '🧠 Estadística Descriptiva';
      case 'VISUALIZATIONS_CHARTS':
        return '📊 AHORA VEÁMOSLO';
      case 'FINAL_CHALLENGE':
        return '🏆 Reto Final';
      case 'VICTORY_SCREEN':
        return '🎉 ¡Misión Cumplida!';
      default:
        return '🌆 Guayaquil: Misión de Datos';
    }
  };

  return (
    <header className="w-full h-16 bg-slate-950/95 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white select-none z-50">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md">
          <Compass className="w-5 h-5 font-bold" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-black tracking-tight leading-none text-white">GUAYAQUIL</h1>
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none mt-0.5">
            Misión de Datos
          </p>
        </div>
      </div>

      {/* Center Stage Name */}
      <div className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs sm:text-sm font-black text-cyan-300">
        {getSceneTitle()}
      </div>

      {/* Right Stats & Reset */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-inner">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>{totalDataCount} Datos</span>
        </div>

        <button
          id="hud-restart-btn"
          onClick={onRestart}
          title="Reiniciar Juego"
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
