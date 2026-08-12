import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  AlignLeft,
  Flame,
  Ruler,
  ScatterChart as ScatterIcon,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CollectedData, StatConceptKey } from '../../types';
import {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateRange,
  calculateStdDev,
} from '../../utils/statsHelpers';
import { playSound } from '../../utils/audio';

import lasPenasImg from '../../assets/images/las_penas_1786558450466.jpg';

interface SceneDescriptiveStatsProps {
  collectedData: CollectedData;
  onProceedToCharts: () => void;
}

export const SceneDescriptiveStats: React.FC<SceneDescriptiveStatsProps> = ({
  collectedData,
  onProceedToCharts,
}) => {
  const [activeConcept, setActiveConcept] = useState<StatConceptKey>('media');

  // We use the Iguana dataset as the primary dataset for interactive demonstration
  // raw dataset: [12, 14, 13, 15, 14, 13, 80]
  const dataset = collectedData.iguanaValues.length > 0 ? collectedData.iguanaValues : [12, 14, 13, 15, 14, 13, 80];

  const meanVal = calculateMean(dataset);
  const medianVal = calculateMedian(dataset);
  const modeVal = calculateMode(dataset);
  const rangeInfo = calculateRange(dataset);
  const stdDevVal = calculateStdDev(dataset);

  const sortedDataset = [...dataset].sort((a, b) => a - b);

  const handleSelectConcept = (concept: StatConceptKey) => {
    playSound.selectData();
    setActiveConcept(concept);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Background with blurred dusk cityscape */}
      <div className="absolute inset-0 z-0">
        <img
          src={lasPenasImg}
          alt="Guayaquil Sunset"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-md brightness-30"
        />
        <div className="absolute inset-0 bg-slate-950/90" />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Descubriendo nuestros datos
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          ¿Qué nos están contando nuestros datos?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-1 font-medium">
          Selecciona cada concepto para ver la transformación directamente sobre tus números.
        </p>
      </div>

      {/* Concept Selector Pills */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-4 flex flex-wrap justify-center gap-2 sm:gap-3">
        <button
          id="stat-concept-media"
          onClick={() => handleSelectConcept('media')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeConcept === 'media'
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/30 scale-105'
              : 'bg-slate-900/90 text-cyan-300 border-slate-700 hover:border-cyan-400'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>MEDIA</span>
        </button>

        <button
          id="stat-concept-mediana"
          onClick={() => handleSelectConcept('mediana')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeConcept === 'mediana'
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/30 scale-105'
              : 'bg-slate-900/90 text-emerald-300 border-slate-700 hover:border-emerald-400'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
          <span>MEDIANA</span>
        </button>

        <button
          id="stat-concept-moda"
          onClick={() => handleSelectConcept('moda')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeConcept === 'moda'
              ? 'bg-rose-500 text-white border-rose-300 shadow-lg shadow-rose-500/30 scale-105'
              : 'bg-slate-900/90 text-rose-300 border-slate-700 hover:border-rose-400'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>MODA</span>
        </button>

        <button
          id="stat-concept-rango"
          onClick={() => handleSelectConcept('rango')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeConcept === 'rango'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 scale-105'
              : 'bg-slate-900/90 text-amber-300 border-slate-700 hover:border-amber-400'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>RANGO</span>
        </button>

        <button
          id="stat-concept-dispersion"
          onClick={() => handleSelectConcept('dispersion')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeConcept === 'dispersion'
              ? 'bg-purple-500 text-white border-purple-300 shadow-lg shadow-purple-500/30 scale-105'
              : 'bg-slate-900/90 text-purple-300 border-slate-700 hover:border-purple-400'
          }`}
        >
          <ScatterIcon className="w-4 h-4" />
          <span>DISPERSIÓN</span>
        </button>

        <button
          id="stat-concept-atipico"
          onClick={() => handleSelectConcept('atipico')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeConcept === 'atipico'
              ? 'bg-orange-500 text-slate-950 border-orange-300 shadow-lg shadow-orange-500/30 scale-105'
              : 'bg-slate-900/90 text-orange-300 border-slate-700 hover:border-orange-400'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>VALOR ATÍPICO</span>
        </button>
      </div>

      {/* Interactive Data Display Stage (ANIMATION HAPPENS OVER THE DATA) */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
        {/* Human Friendly Explanation Box */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          {activeConcept === 'media' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-200 text-base sm:text-lg font-medium">
              “Es básicamente el promedio. Si juntamos todos los datos y los repartimos por igual, eso nos da la media.”
            </motion.p>
          )}

          {activeConcept === 'mediana' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-200 text-base sm:text-lg font-medium">
              “Ordenamos los datos de menor a mayor y buscamos quién quedó justo en el medio.”
            </motion.p>
          )}

          {activeConcept === 'moda' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-200 text-base sm:text-lg font-medium">
              “Es el dato que más veces se repite en nuestro grupo.”
            </motion.p>
          )}

          {activeConcept === 'rango' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-200 text-base sm:text-lg font-medium">
              “Es la distancia directa que hay entre el dato más pequeño y el más grande.”
            </motion.p>
          )}

          {activeConcept === 'dispersion' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-200 text-base sm:text-lg font-medium">
              “Aquí vemos qué tan juntitos están los números o si están muy regados entre sí.”
            </motion.p>
          )}

          {activeConcept === 'atipico' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-200 text-base sm:text-lg font-medium">
              “Es un dato inusual que se aleja muchísimo de los demás valores.”
            </motion.p>
          )}
        </div>

        {/* Dynamic Number Nodes Array */}
        <div className="min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {/* MEDIA VIEW */}
            {activeConcept === 'media' && (
              <motion.div
                key="media-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {dataset.map((val, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      className="px-4 py-3 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-cyan-200 font-black text-xl shadow-lg"
                    >
                      {val}
                    </motion.div>
                  ))}
                </div>
                <div className="w-full max-w-md h-3 bg-slate-800 rounded-full overflow-hidden my-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="text-2xl font-black text-cyan-300">
                  Suma total: {dataset.reduce((a, b) => a + b, 0)} ÷ {dataset.length} items ={' '}
                  <span className="text-3xl text-emerald-400">{meanVal}</span>
                </div>
              </motion.div>
            )}

            {/* MEDIANA VIEW */}
            {activeConcept === 'mediana' && (
              <motion.div
                key="mediana-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Datos ordenados de menor a mayor:
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {sortedDataset.map((val, idx) => {
                    const isMid = idx === Math.floor(sortedDataset.length / 2);
                    return (
                      <motion.div
                        key={idx}
                        layout
                        className={`px-4 py-3 rounded-2xl font-black text-xl transition-all ${
                          isMid
                            ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-200 scale-125 shadow-2xl shadow-emerald-500/50 ring-4 ring-emerald-400/40'
                            : 'bg-slate-950 border border-slate-700 text-slate-300'
                        }`}
                      >
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xl font-black text-emerald-300">
                  El valor en la posición central es: <span className="text-3xl text-white">{medianVal}</span>
                </div>
              </motion.div>
            )}

            {/* MODA VIEW */}
            {activeConcept === 'moda' && (
              <motion.div
                key="moda-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {dataset.map((val, idx) => {
                    const isMode = modeVal.includes(val);
                    return (
                      <motion.div
                        key={idx}
                        layout
                        className={`px-4 py-3 rounded-2xl font-black text-xl transition-all ${
                          isMode
                            ? 'bg-rose-500 text-white border-2 border-rose-300 scale-110 shadow-xl shadow-rose-500/50 animate-pulse'
                            : 'bg-slate-950 border border-slate-800 text-slate-500 opacity-60'
                        }`}
                      >
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xl font-black text-rose-300">
                  El dato que más se repite es: <span className="text-3xl text-white">{modeVal.join(', ')}</span>
                </div>
              </motion.div>
            )}

            {/* RANGO VIEW */}
            {activeConcept === 'rango' && (
              <motion.div
                key="rango-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {sortedDataset.map((val, idx) => {
                    const isMin = val === rangeInfo.min && idx === 0;
                    const isMax = val === rangeInfo.max && idx === sortedDataset.length - 1;
                    return (
                      <motion.div
                        key={idx}
                        layout
                        className={`px-4 py-3 rounded-2xl font-black text-xl transition-all ${
                          isMin || isMax
                            ? 'bg-amber-500 text-slate-950 border-2 border-amber-200 scale-115 shadow-xl shadow-amber-500/40'
                            : 'bg-slate-950 border border-slate-800 text-slate-500'
                        }`}
                      >
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xl font-black text-amber-300">
                  Distancia: Máximo ({rangeInfo.max}) - Mínimo ({rangeInfo.min}) ={' '}
                  <span className="text-3xl text-white">{rangeInfo.range}</span>
                </div>
              </motion.div>
            )}

            {/* DISPERSIÓN VIEW */}
            {activeConcept === 'dispersion' && (
              <motion.div
                key="dispersion-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {dataset.map((val, idx) => {
                    const diff = Math.abs(val - meanVal).toFixed(1);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-purple-300 font-bold">d: {diff}</span>
                        <motion.div
                          layout
                          className="px-3 py-2 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-200 font-black text-lg"
                        >
                          {val}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xl font-black text-purple-300">
                  Desviación estándar: <span className="text-3xl text-white">{stdDevVal}</span>
                </div>
              </motion.div>
            )}

            {/* ATÍPICO VIEW */}
            {activeConcept === 'atipico' && (
              <motion.div
                key="atipico-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {dataset.map((val, idx) => {
                    const isOutlier = val === 80;
                    return (
                      <motion.div
                        key={idx}
                        layout
                        animate={isOutlier ? { x: [0, 15, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`px-4 py-3 rounded-2xl font-black text-xl transition-all ${
                          isOutlier
                            ? 'bg-orange-500 text-slate-950 border-2 border-orange-200 scale-125 shadow-2xl shadow-orange-500/50 font-black'
                            : 'bg-slate-950 border border-slate-700 text-slate-300'
                        }`}
                      >
                        {val} {isOutlier ? '⚡' : ''}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xl font-black text-orange-300">
                  Valor atípico separado: <span className="text-3xl text-white">80</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="relative z-10 max-w-4xl mx-auto w-full mt-4 flex items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-slate-400 font-medium hidden sm:block">
          Siguiente: Ver la representación en gráficos visuales
        </p>

        <button
          id="stat-proceed-charts-btn"
          onClick={onProceedToCharts}
          className="w-full sm:w-auto ml-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <span>Ir a "AHORA VEÁMOSLO" (Gráficos)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
