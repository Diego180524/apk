import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, AlertTriangle, ArrowRight, Eye, CheckCircle2, MapPin } from 'lucide-react';
import { playSound } from '../../utils/audio';

import entradaImg from '../../assets/images/parque_seminario_entrada_1786560273593.jpg';
import arbolImg from '../../assets/images/parque_seminario_iguanas_arbol_1786560289131.jpg';
import glorietaImg from '../../assets/images/parque_seminario_glorieta_1786560303049.jpg';
import catedralImg from '../../assets/images/parque_seminario_1786558417153.jpg';

interface Scene3Props {
  onComplete: (iguanaData: number[]) => void;
}

interface DiscoverableIguana {
  id: string;
  val: number;
  label: string;
  xPercent: number;
  yPercent: number;
  isOutlier?: boolean;
}

// Sub-scene 2 Iguanas (Zone 1: Árboles y Raíces)
const ZONE_1_IGUANAS: DiscoverableIguana[] = [
  { id: 'z1-1', val: 12, label: 'Iguana del Árbol', xPercent: 28, yPercent: 45 },
  { id: 'z1-2', val: 14, label: 'Iguana de la Raíz', xPercent: 55, yPercent: 65 },
  { id: 'z1-3', val: 13, label: 'Iguana en la Rama', xPercent: 78, yPercent: 38 },
];

// Sub-scene 3 Iguanas (Zone 2: La Glorieta)
const ZONE_2_IGUANAS: DiscoverableIguana[] = [
  { id: 'z2-1', val: 15, label: 'Iguana del Borde', xPercent: 25, yPercent: 70 },
  { id: 'z2-2', val: 14, label: 'Iguana del Caminito', xPercent: 48, yPercent: 52 },
  { id: 'z2-3', val: 13, label: 'Iguana de la Palma', xPercent: 75, yPercent: 62 },
];

// Sub-scene 4 Iguana Outlier (Zone 3: Área Central)
const OUTLIER_IGUANA: DiscoverableIguana = {
  id: 'z3-outlier',
  val: 80,
  label: 'Iguana Misteriosa',
  xPercent: 58,
  yPercent: 48,
  isOutlier: true,
};

type MissionSubStage = 'ENTRADA' | 'ZONA_1_ARBOLES' | 'ZONA_2_GLORIETA' | 'ZONA_3_OUTLIER';

export const Scene3ParqueSeminario: React.FC<Scene3Props> = ({ onComplete }) => {
  const [stage, setStage] = useState<MissionSubStage>('ENTRADA');
  const [discoveredZone1, setDiscoveredZone1] = useState<string[]>([]);
  const [discoveredZone2, setDiscoveredZone2] = useState<string[]>([]);
  const [foundOutlier, setFoundOutlier] = useState(false);
  const [lastDiscoveredVal, setLastDiscoveredVal] = useState<number | null>(null);

  // All collected numbers so far
  const currentDiscoveredNumbers = [
    ...ZONE_1_IGUANAS.filter((ig) => discoveredZone1.includes(ig.id)).map((ig) => ig.val),
    ...ZONE_2_IGUANAS.filter((ig) => discoveredZone2.includes(ig.id)).map((ig) => ig.val),
  ];

  const handleTapZone1 = (ig: DiscoverableIguana) => {
    if (discoveredZone1.includes(ig.id)) return;
    playSound.selectData();
    setDiscoveredZone1([...discoveredZone1, ig.id]);
    setLastDiscoveredVal(ig.val);
  };

  const handleTapZone2 = (ig: DiscoverableIguana) => {
    if (discoveredZone2.includes(ig.id)) return;
    playSound.selectData();
    setDiscoveredZone2([...discoveredZone2, ig.id]);
    setLastDiscoveredVal(ig.val);
  };

  const handleTapOutlier = () => {
    if (foundOutlier) return;
    playSound.foundOutlier();
    setFoundOutlier(true);
  };

  const handleFinishMission = () => {
    playSound.click();
    const finalValues = [12, 14, 13, 15, 14, 13, 80];
    onComplete(finalValues);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-between select-none">
      {/* Dynamic Background Image transitions between sub-scenes */}
      <AnimatePresence mode="wait">
        {stage === 'ENTRADA' && (
          <motion.div
            key="bg-entrada"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={entradaImg}
              alt="Entrada Parque Seminario"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />
          </motion.div>
        )}

        {stage === 'ZONA_1_ARBOLES' && (
          <motion.div
            key="bg-zona1"
            initial={{ opacity: 0, scale: 1.15, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -50 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={arbolImg}
              alt="Zona de Árboles Parque Seminario"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />
          </motion.div>
        )}

        {stage === 'ZONA_2_GLORIETA' && (
          <motion.div
            key="bg-zona2"
            initial={{ opacity: 0, scale: 1.15, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -50 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={glorietaImg}
              alt="Glorieta Parque Seminario"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />
          </motion.div>
        )}

        {stage === 'ZONA_3_OUTLIER' && (
          <motion.div
            key="bg-zona3"
            initial={{ opacity: 0, scale: 1.15, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={catedralImg}
              alt="Área Central Catedral Parque Seminario"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Banner */}
      <div className="relative z-10 p-4 sm:p-6 max-w-4xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-2 shadow-lg"
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          Misión 3 — Parque Seminario
        </motion.div>

        {stage === 'ENTRADA' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md tracking-tight">
              Llegamos al Parque Seminario...
            </h2>
            <p className="text-slate-200 text-sm sm:text-base mt-1 font-medium">
              Tenemos varios datos repartidos en distintas zonas del parque... ¿puedes encontrar el que parece extraño?
            </p>
          </motion.div>
        )}

        {stage === 'ZONA_1_ARBOLES' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md tracking-tight">
              Zona 1: Árboles y Raíces Tropicales 🌿
            </h2>
            <p className="text-slate-200 text-sm sm:text-base mt-1 font-medium">
              Toca las iguanas ocultas entre los árboles para descubrir sus datos.
            </p>
          </motion.div>
        )}

        {stage === 'ZONA_2_GLORIETA' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md tracking-tight">
              Zona 2: Paseo de la Glorieta 🏰
            </h2>
            <p className="text-slate-200 text-sm sm:text-base mt-1 font-medium">
              Explora esta nueva área del parque y descubre más datos en las iguanas del caminito.
            </p>
          </motion.div>
        )}

        {stage === 'ZONA_3_OUTLIER' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md tracking-tight">
              Zona 3: Área de la Catedral ⛪
            </h2>
            <p className="text-slate-200 text-sm sm:text-base mt-1 font-medium">
              Observa todos los datos encontrados... ¡Una de las iguanas tiene un valor muy diferente!
            </p>
          </motion.div>
        )}
      </div>

      {/* Main Interactive Scene Content */}
      <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto my-2 pointer-events-none flex flex-col justify-center items-center">
        {/* SUB-STAGE 1: ENTRADA */}
        {stage === 'ENTRADA' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto bg-slate-900/90 border border-emerald-500/50 backdrop-blur-xl p-6 sm:p-8 rounded-3xl max-w-md mx-4 text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl border border-emerald-400/50 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">¡Comienza la Exploración!</h3>
            <p className="text-slate-300 text-sm font-medium mb-6">
              Recorreremos varias zonas del parque para observar y descubrir los datos directamente desde su entorno natural.
            </p>
            <button
              id="start-park-exploration-btn"
              onClick={() => {
                playSound.click();
                setStage('ZONA_1_ARBOLES');
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Explorar Zona 1 — Los Árboles</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* SUB-STAGE 2: ZONA 1 (ARBOLES) */}
        {stage === 'ZONA_1_ARBOLES' && (
          <div className="w-full h-full relative">
            {ZONE_1_IGUANAS.map((ig) => {
              const isDiscovered = discoveredZone1.includes(ig.id);
              return (
                <motion.div
                  key={ig.id}
                  style={{ left: `${ig.xPercent}%`, top: `${ig.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <button
                    id={`iguana-z1-${ig.id}`}
                    onClick={() => handleTapZone1(ig)}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-md font-black border transition-all duration-300 shadow-2xl cursor-pointer ${
                      isDiscovered
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-4 ring-emerald-400/40 shadow-emerald-500/40 scale-105'
                        : 'bg-slate-900/90 border-emerald-500/60 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">🦎</span>
                    {isDiscovered ? (
                      <span className="text-xl font-black text-slate-950 flex items-center gap-1">
                        {ig.val}
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      </span>
                    ) : (
                      <span className="text-xs font-bold uppercase text-emerald-300 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 animate-pulse" /> Descubrir
                      </span>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* SUB-STAGE 3: ZONA 2 (GLORIETA) */}
        {stage === 'ZONA_2_GLORIETA' && (
          <div className="w-full h-full relative">
            {ZONE_2_IGUANAS.map((ig) => {
              const isDiscovered = discoveredZone2.includes(ig.id);
              return (
                <motion.div
                  key={ig.id}
                  style={{ left: `${ig.xPercent}%`, top: `${ig.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <button
                    id={`iguana-z2-${ig.id}`}
                    onClick={() => handleTapZone2(ig)}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-md font-black border transition-all duration-300 shadow-2xl cursor-pointer ${
                      isDiscovered
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-4 ring-cyan-400/40 shadow-cyan-500/40 scale-105'
                        : 'bg-slate-900/90 border-cyan-500/60 text-cyan-300 hover:bg-cyan-600 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">🦎</span>
                    {isDiscovered ? (
                      <span className="text-xl font-black text-slate-950 flex items-center gap-1">
                        {ig.val}
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      </span>
                    ) : (
                      <span className="text-xs font-bold uppercase text-cyan-300 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 animate-pulse" /> Descubrir
                      </span>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* SUB-STAGE 4: ZONA 3 (OUTLIER 80) */}
        {stage === 'ZONA_3_OUTLIER' && (
          <div className="w-full h-full relative flex flex-col items-center justify-center">
            {/* Previously gathered numbers badge row */}
            <div className="absolute top-4 pointer-events-auto flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 border border-slate-700 p-3 rounded-2xl backdrop-blur-md">
              <span className="text-xs font-bold text-slate-300 uppercase mr-1">Datos normales:</span>
              {currentDiscoveredNumbers.map((num, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
                >
                  {num}
                </span>
              ))}
            </div>

            {/* Glowing Outlier Iguana 80 */}
            <motion.div
              style={{ left: `${OUTLIER_IGUANA.xPercent}%`, top: `${OUTLIER_IGUANA.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              animate={foundOutlier ? { scale: 1.25 } : { scale: [1, 1.1, 1] }}
              transition={{ repeat: foundOutlier ? 0 : Infinity, duration: 1.5 }}
            >
              <button
                id="iguana-outlier-80"
                onClick={handleTapOutlier}
                className={`group relative flex items-center gap-3 px-5 py-3 rounded-3xl backdrop-blur-md font-black border transition-all duration-300 shadow-2xl cursor-pointer ${
                  foundOutlier
                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-8 ring-amber-400/50 shadow-amber-500/50 scale-125'
                    : 'bg-slate-900/90 border-amber-400 text-amber-300 hover:bg-amber-500 hover:text-slate-950 shadow-amber-500/30'
                }`}
              >
                <span className="text-3xl">🦎</span>
                <span className="text-2xl sm:text-3xl font-black">{OUTLIER_IGUANA.val}</span>
                {foundOutlier && <AlertTriangle className="w-6 h-6 text-slate-950 animate-bounce" />}
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Discovery Feedback Toast Notification */}
      <AnimatePresence>
        {foundOutlier && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative z-20 self-center max-w-xl mx-4 bg-slate-900/95 border-2 border-amber-400 p-5 sm:p-6 rounded-3xl text-center shadow-2xl shadow-amber-500/30 backdrop-blur-2xl mb-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              ¡Encontraste el dato extraño!
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-snug">
              Los demás datos están cerca entre sí (12–15), pero el <span className="text-amber-400 text-3xl font-black">80</span> se aleja muchísimo.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-medium mb-4">
              En estadística, a un dato tan distante se le conoce como <strong className="text-amber-300">VALOR ATÍPICO</strong>.
            </p>

            <button
              id="iguana-proceed-to-gather-btn"
              onClick={handleFinishMission}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>¡Misiones completadas! Unir datos</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls / Sub-Scene Navigation Bar */}
      <div className="relative z-20 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {stage === 'ZONA_1_ARBOLES' && (
            <>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">
                Iguanas descubiertas en Zona 1: <strong className="text-emerald-400">{discoveredZone1.length}</strong> / 3
              </div>
              <button
                id="next-zone-2-btn"
                disabled={discoveredZone1.length < 3}
                onClick={() => {
                  playSound.click();
                  setStage('ZONA_2_GLORIETA');
                }}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  discoveredZone1.length === 3
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg cursor-pointer active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Avanzar a Zona 2 (La Glorieta)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {stage === 'ZONA_2_GLORIETA' && (
            <>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">
                Iguanas descubiertas en Zona 2: <strong className="text-cyan-400">{discoveredZone2.length}</strong> / 3
              </div>
              <button
                id="next-zone-3-btn"
                disabled={discoveredZone2.length < 3}
                onClick={() => {
                  playSound.click();
                  setStage('ZONA_3_OUTLIER');
                }}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  discoveredZone2.length === 3
                    ? 'bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-950 shadow-lg cursor-pointer active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Avanzar a Zona 3 (Área Catedral)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {stage === 'ZONA_3_OUTLIER' && !foundOutlier && (
            <div className="w-full text-center text-xs sm:text-sm text-amber-300 font-bold animate-pulse">
              🔍 Toca la iguana misteriosa con el número inusual para descubrir el dato extraño.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

