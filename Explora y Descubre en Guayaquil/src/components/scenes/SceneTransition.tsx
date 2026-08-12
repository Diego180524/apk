import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Database, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CollectedData } from '../../types';
import { playSound } from '../../utils/audio';

import maleconImg from '../../assets/images/malecon_2000_1786558379908.jpg';

interface SceneTransitionProps {
  collectedData: CollectedData;
  onProceed: () => void;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({ collectedData, onProceed }) => {
  useEffect(() => {
    playSound.foundOutlier();
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-6 text-white">
      {/* Background with blurred city backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={maleconImg}
          alt="Guayaquil Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-md brightness-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
      </div>

      {/* Top Banner */}
      <div className="relative z-10 max-w-2xl text-center mt-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-16 h-16 mx-auto bg-gradient-to-tr from-cyan-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 mb-4"
        >
          <Database className="w-8 h-8 text-slate-950" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl font-black text-white tracking-tight"
        >
          ¡LISTO!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-cyan-300 text-lg sm:text-2xl font-bold mt-1"
        >
          Ya tenemos todos nuestros datos de Guayaquil.
        </motion.p>
      </div>

      {/* Floating Converging Data Orbs Container */}
      <div className="relative z-10 w-full max-w-4xl my-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Dataset Card 1: Malecón */}
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/90 border border-cyan-500/40 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Malecón 2000</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Actividades Elegidas</h3>
            <div className="flex flex-wrap gap-1.5">
              {collectedData.maleconActivities.map((act, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-200 text-xs font-semibold"
                >
                  {act.name} ({act.minutes}m)
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-medium">
            Total items: {collectedData.maleconActivities.length}
          </div>
        </motion.div>

        {/* Dataset Card 2: Ruta */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/90 border border-amber-500/40 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ruta Chiva</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Tiempos de Tránsito</h3>
            <div className="flex flex-wrap gap-1.5">
              {collectedData.rutaTimes.map((time, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-500/30 text-amber-200 text-xs font-semibold"
                >
                  Tramo {i + 1}: {time} min
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-medium">
            Tiempos registrados: {collectedData.rutaTimes.join(', ')} min
          </div>
        </motion.div>

        {/* Dataset Card 3: Parque */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-900/90 border border-emerald-500/40 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Parque Seminario</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Iguanas y Atípico</h3>
            <div className="flex flex-wrap gap-1.5">
              {collectedData.iguanaValues.map((val, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-xl border text-xs font-bold ${
                    val === 80
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-black animate-pulse'
                      : 'bg-emerald-950 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  {val} {val === 80 ? '⚡ (Atípico)' : ''}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-medium">
            Muestra total: {collectedData.iguanaValues.length} observaciones
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 mb-6 text-center"
      >
        <p className="text-slate-300 text-base sm:text-lg mb-3 font-medium">
          "Ahora veamos qué nos están contando estos datos."
        </p>

        <button
          id="transition-discover-btn"
          onClick={onProceed}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-black text-lg shadow-2xl shadow-cyan-500/30 flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-all"
        >
          <Sparkles className="w-6 h-6 text-slate-950 animate-bounce" />
          <span>Descubrir la Estadística Descriptiva</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
};
