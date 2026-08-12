import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Footprints, Bike, Waves, Camera, Check, Compass, Sparkles } from 'lucide-react';
import { ActivityChoice } from '../../types';
import { playSound } from '../../utils/audio';

// Local image imported directly
import maleconImg from '../../assets/images/malecon_2000_1786558379908.jpg';

interface Scene1Props {
  onComplete: (selectedActivities: { name: string; minutes: number }[]) => void;
}

const ACTIVITIES: ActivityChoice[] = [
  {
    id: 'caminar',
    name: 'Caminar por el Malecón',
    durationMin: 45,
    iconName: 'Footprints',
    category: 'Paseo',
    description: 'Recorrer la brisa del Guayas a pie.',
    xPercent: 28,
    yPercent: 65,
  },
  {
    id: 'bici',
    name: 'Pasear en bicicleta',
    durationMin: 20,
    iconName: 'Bike',
    category: 'Deporte',
    description: 'Rodar rápido por la ciclovía junto al río.',
    xPercent: 58,
    yPercent: 72,
  },
  {
    id: 'rio',
    name: 'Observar el Río Guayas',
    durationMin: 30,
    iconName: 'Waves',
    category: 'Relax',
    description: 'Disfrutar la vista de las embarcaciones.',
    xPercent: 80,
    yPercent: 55,
  },
  {
    id: 'fotos',
    name: 'Tomar fotos en La Perla',
    durationMin: 15,
    iconName: 'Camera',
    category: 'Fotografía',
    description: 'Capturar la gran rueda gigante y el skyline.',
    xPercent: 44,
    yPercent: 32,
  },
];

export const Scene1Malecon: React.FC<Scene1Props> = ({ onComplete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastSelected, setLastSelected] = useState<ActivityChoice | null>(null);

  const toggleActivity = (act: ActivityChoice) => {
    playSound.selectData();
    setLastSelected(act);
    if (selectedIds.includes(act.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== act.id));
    } else {
      setSelectedIds([...selectedIds, act.id]);
    }
  };

  const handleNext = () => {
    if (selectedIds.length === 0) return;
    playSound.click();
    const chosen = ACTIVITIES.filter((a) => selectedIds.includes(a.id)).map((a) => ({
      name: a.name,
      minutes: a.durationMin,
    }));
    onComplete(chosen);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-6 h-6 text-emerald-400" />;
      case 'Bike':
        return <Bike className="w-6 h-6 text-sky-400" />;
      case 'Waves':
        return <Waves className="w-6 h-6 text-cyan-400" />;
      case 'Camera':
        return <Camera className="w-6 h-6 text-amber-400" />;
      default:
        return <Compass className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-between">
      {/* Background Image full scene */}
      <div className="absolute inset-0 z-0">
        <img
          src={maleconImg}
          alt="Malecón 2000 Guayaquil"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-90 contrast-105 scale-105 transition-transform duration-1000"
        />
        {/* Subtle gradient vignette overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60 pointer-events-none" />
      </div>

      {/* Top Mission Header */}
      <div className="relative z-10 p-4 sm:p-6 max-w-4xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-2 shadow-lg"
        >
          <Compass className="w-4 h-4 animate-spin-slow text-cyan-400" />
          Misión 1 — Malecón 2000
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md tracking-tight"
        >
          ¿Qué actividades te gustaría realizar?
        </motion.h2>
        <p className="text-slate-200 text-sm sm:text-base mt-1 drop-shadow font-medium">
          Toca los elementos interactivos en la escena para registrarlos como datos.
        </p>
      </div>

      {/* Interactive Spots directly on top of the background picture */}
      <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto my-2 pointer-events-none">
        {ACTIVITIES.map((act) => {
          const isSelected = selectedIds.includes(act.id);
          return (
            <motion.div
              key={act.id}
              style={{ left: `${act.xPercent}%`, top: `${act.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                id={`malecon-spot-${act.id}`}
                onClick={() => toggleActivity(act)}
                className={`relative group flex items-center gap-2 px-3 py-2 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-2xl border ${
                  isSelected
                    ? 'bg-emerald-500/90 border-emerald-300 text-white shadow-emerald-500/30 ring-4 ring-emerald-400/40'
                    : 'bg-slate-900/85 border-slate-700/80 text-slate-100 hover:bg-slate-800/90 hover:border-cyan-400'
                }`}
              >
                {/* Glowing ripple radar effect */}
                <span className="absolute -inset-1 rounded-2xl bg-cyan-400/20 animate-ping opacity-75 group-hover:opacity-100 pointer-events-none" />

                <div className="p-2 rounded-xl bg-slate-950/60 shadow-inner flex items-center justify-center">
                  {renderIcon(act.iconName)}
                </div>

                <div className="text-left pr-1">
                  <div className="text-xs sm:text-sm font-bold leading-tight flex items-center gap-1.5">
                    {act.name}
                    {isSelected && <Check className="w-4 h-4 text-emerald-200" />}
                  </div>
                  <div className="text-[11px] text-cyan-200/90 font-medium">{act.durationMin} minutos</div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Last selected reaction feedback toast */}
      <AnimatePresence>
        {lastSelected && (
          <motion.div
            key={lastSelected.id}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 self-center bg-slate-900/90 border border-emerald-500/50 backdrop-blur-md px-4 py-2 rounded-xl text-emerald-300 text-xs sm:text-sm flex items-center gap-2 shadow-xl mb-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>
              ¡Dato registrado! <strong className="text-white">{lastSelected.name}</strong> ({lastSelected.durationMin} min)
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Bar */}
      <div className="relative z-20 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs sm:text-sm text-slate-300 font-medium">
              Datos recolectados: <strong className="text-emerald-400 text-base">{selectedIds.length}</strong> / 4
            </div>
            {selectedIds.length > 0 && (
              <div className="flex -space-x-2">
                {selectedIds.map((id) => (
                  <span
                    key={id}
                    className="w-7 h-7 rounded-full bg-cyan-600 border-2 border-slate-900 text-white text-[11px] flex items-center justify-center font-bold"
                  >
                    ✓
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            id="malecon-next-btn"
            disabled={selectedIds.length === 0}
            onClick={handleNext}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
              selectedIds.length > 0
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/25 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Llegar a la siguiente misión</span>
            <span className="text-lg">➡️</span>
          </button>
        </div>
      </div>
    </div>
  );
};
