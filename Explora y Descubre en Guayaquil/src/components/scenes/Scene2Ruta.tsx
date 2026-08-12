import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, MapPin, Gauge, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';
import { playSound } from '../../utils/audio';

import rutaImg from '../../assets/images/ruta_guayaquil_1786558435159.jpg';

interface Scene2Props {
  onComplete: (times: number[]) => void;
}

interface Checkpoint {
  id: number;
  fromName: string;
  toName: string;
  distKm: number;
}

const CHECKPOINTS: Checkpoint[] = [
  { id: 1, fromName: 'Malecón 2000', toName: 'Las Peñas', distKm: 2.5 },
  { id: 2, fromName: 'Las Peñas', toName: 'Puerto Santa Ana', distKm: 1.8 },
  { id: 3, fromName: 'Puerto Santa Ana', toName: 'Parque Seminario', distKm: 3.2 },
  { id: 4, fromName: 'Parque Seminario', toName: 'Plaza Rodolfo Baquerizo', distKm: 2.1 },
];

const TIME_OPTIONS = [5, 10, 15, 20, 25];

export const Scene2Ruta: React.FC<Scene2Props> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [collectedTimes, setCollectedTimes] = useState<number[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [lastSelectedTime, setLastSelectedTime] = useState<number | null>(null);

  const activeCheckpoint = CHECKPOINTS[currentStage];

  const handleSelectTime = (mins: number) => {
    if (isMoving) return;

    playSound.vehicleEngine();
    setIsMoving(true);
    setLastSelectedTime(mins);

    const updatedTimes = [...collectedTimes, mins];
    setCollectedTimes(updatedTimes);

    // Vehicle driving animation duration
    setTimeout(() => {
      setIsMoving(false);
      if (currentStage + 1 < CHECKPOINTS.length) {
        setCurrentStage(currentStage + 1);
      } else {
        // Completed all checkpoints
        onComplete(updatedTimes);
      }
    }, 1800);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-between">
      {/* Scenic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={rutaImg}
          alt="Ruta Guayaquil"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-90 contrast-105 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 pointer-events-none" />
      </div>

      {/* Top Mission Banner */}
      <div className="relative z-10 p-4 sm:p-6 max-w-4xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-2 shadow-lg"
        >
          <Navigation className="w-4 h-4 text-amber-400" />
          Misión 2 — Ruta por Guayaquil
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md tracking-tight"
        >
          {activeCheckpoint ? (
            <>
              Tramo {currentStage + 1} de {CHECKPOINTS.length}:{' '}
              <span className="text-amber-300">{activeCheckpoint.fromName}</span> ➔{' '}
              <span className="text-cyan-300">{activeCheckpoint.toName}</span>
            </>
          ) : (
            '¡Ruta Completada!'
          )}
        </motion.h2>

        <p className="text-slate-200 text-sm sm:text-base mt-1 font-medium">
          ¿Cuánto tiempo estimas para este tramo? Selecciona para avanzar el vehículo.
        </p>
      </div>

      {/* Center Interactive Route & Animated Vehicle */}
      <div className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center">
        {/* Animated Highway Track */}
        <div className="relative w-full h-28 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700/80 p-4 flex items-center shadow-2xl overflow-hidden">
          {/* Dashed Road Line */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-1 border-t-2 border-dashed border-slate-500/60" />

          {/* Start and End Pin Markers */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/50">
            <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-xs font-bold text-amber-200">{activeCheckpoint?.fromName}</span>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-cyan-500/20 px-3 py-1 rounded-xl border border-cyan-500/50">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-200">{activeCheckpoint?.toName}</span>
          </div>

          {/* Animated Moving Vehicle (Guayaquil Chiva / Bus) */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 p-2.5 rounded-2xl shadow-xl shadow-amber-500/40 border border-amber-200 text-slate-950 font-black"
            initial={{ left: '15%' }}
            animate={{
              left: isMoving ? '82%' : '15%',
            }}
            transition={{
              duration: isMoving ? 1.7 : 0.3,
              ease: 'easeInOut',
            }}
          >
            <Bus className="w-6 h-6 text-slate-950 animate-pulse" />
            <span className="text-xs tracking-wider uppercase font-black hidden sm:inline">Chiva Express</span>

            {/* Exhaust sparkle particles while driving */}
            {isMoving && (
              <motion.div
                initial={{ opacity: 1, scale: 0.5 }}
                animate={{ opacity: 0, scale: 1.5, x: -20 }}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full blur-xs"
              />
            )}
          </motion.div>
        </div>

        {/* Reaction Feedback */}
        <AnimatePresence>
          {isMoving && lastSelectedTime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-sm flex items-center gap-2 backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Registrado: {lastSelectedTime} minutos en viaje 🚌</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Choice Options & Progress Footer */}
      <div className="relative z-20 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="text-xs sm:text-sm text-slate-300 font-semibold flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>Selecciona tu tiempo estimado para este tramo:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full">
            {TIME_OPTIONS.map((mins) => (
              <button
                key={mins}
                id={`ruta-time-${mins}`}
                disabled={isMoving}
                onClick={() => handleSelectTime(mins)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-black text-sm sm:text-base border transition-all duration-300 shadow-xl ${
                  isMoving
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-900/90 border-slate-700 hover:border-amber-400 hover:bg-amber-500 hover:text-slate-950 text-amber-300 cursor-pointer active:scale-95'
                }`}
              >
                {mins} minutos
              </button>
            ))}
          </div>

          {/* Progress dots for checkpoints */}
          <div className="flex items-center gap-3 mt-1">
            {CHECKPOINTS.map((cp, idx) => (
              <div
                key={cp.id}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                  idx < currentStage
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : idx === currentStage
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 ring-2 ring-amber-400/30'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {idx < currentStage ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span>Tramo {idx + 1}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
