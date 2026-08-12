import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Sparkles, MapPin } from 'lucide-react';
import { playSound } from '../../utils/audio';

import lasPenasImg from '../../assets/images/las_penas_1786558450466.jpg';

interface SceneVictoryProps {
  onRestart: () => void;
}

export const SceneVictory: React.FC<SceneVictoryProps> = ({ onRestart }) => {
  useEffect(() => {
    playSound.victory();

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
    });
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 text-white flex flex-col items-center justify-between p-4 sm:p-6">
      {/* Background with Las Peñas Sunset visual */}
      <div className="absolute inset-0 z-0">
        <img
          src={lasPenasImg}
          alt="Guayaquil Sunset"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-75 contrast-105 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />
      </div>

      {/* Top Banner */}
      <div className="relative z-10 max-w-2xl text-center mt-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-xs sm:text-sm font-bold uppercase mb-4 shadow-xl backdrop-blur-md"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          Guayaquil: Misión de Datos Completada
        </motion.div>
      </div>

      {/* Center Deep Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 max-w-2xl mx-auto my-auto bg-slate-900/90 border-2 border-cyan-500/50 p-8 sm:p-12 rounded-3xl backdrop-blur-2xl text-center shadow-2xl shadow-cyan-500/20"
      >
        <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-6 animate-pulse" />

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
          ¿Ves?
        </h2>

        <p className="text-lg sm:text-2xl font-bold text-slate-200 mb-6 leading-relaxed">
          Todo lo que acabamos de jugar terminó convirtiéndose en <strong className="text-cyan-400">datos</strong>.
        </p>

        <p className="text-base sm:text-xl font-medium text-slate-300 mb-8 leading-relaxed">
          Y esos datos nos permiten entender exactamente lo que está pasando en nuestro entorno.
        </p>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950 to-emerald-950 border border-cyan-500/40 text-cyan-300 text-lg sm:text-2xl font-black uppercase tracking-wider shadow-inner">
          Eso es la estadística descriptiva.
        </div>
      </motion.div>

      {/* Bottom CTA to restart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mb-6"
      >
        <button
          id="victory-restart-btn"
          onClick={onRestart}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-lg shadow-2xl shadow-cyan-500/30 flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-all"
        >
          <RotateCcw className="w-6 h-6 text-slate-950" />
          <span>VOLVER A JUGAR</span>
        </button>
      </motion.div>
    </div>
  );
};
