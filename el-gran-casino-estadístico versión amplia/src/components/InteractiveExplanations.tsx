import React from 'react';
import { Brain, HelpCircle, BarChart2, Compass, Layers, Sparkles } from 'lucide-react';
import { DescriptiveStats, FrequencyRow } from '../types/plinko';

interface InteractiveExplanationsProps {
  stats: DescriptiveStats;
  freqTable: FrequencyRow[];
}

export const InteractiveExplanations: React.FC<InteractiveExplanationsProps> = ({
  stats,
  freqTable,
}) => {
  if (stats.n === 0) return null;

  // Find most frequent row for Moda explanation
  const modeRows = freqTable.filter((r) => stats.mode.includes(r.bin));
  const maxFreq = modeRows.length > 0 ? modeRows[0].absFreq : 0;

  // Find min and max bins landed
  const landedBins = freqTable.filter((r) => r.absFreq > 0);
  const minLanded = landedBins.length > 0 ? landedBins[0].bin : stats.min;
  const maxLanded = landedBins.length > 0 ? landedBins[landedBins.length - 1].bin : stats.max;

  return (
    <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-indigo-500/30 text-slate-100 space-y-5">
      {/* Section Header */}
      <div className="flex items-center space-x-3 border-b border-indigo-500/20 pb-4">
        <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-md shadow-indigo-500/30">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-xl font-black text-indigo-200 uppercase tracking-tight flex items-center space-x-2">
            <span>🧠 ¿QUÉ PASÓ EN TU SIMULACIÓN?</span>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              {stats.n} Lanzamientos Reales
            </span>
          </h2>
          <p className="text-xs text-indigo-300">
            Explicación estadística basada exactamente en los datos de tu partida actual
          </p>
        </div>
      </div>

      {/* Dynamic Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. MEDIA (PROMEDIO) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-300 flex items-center space-x-1.5">
              <span className="p-1 bg-amber-500/20 rounded text-amber-400">📊</span>
              <span>1. Media (Promedio) = {stats.mean.toFixed(2)}</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Centro de Masa
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            <strong className="text-amber-300">En tus {stats.n} lanzamientos:</strong> Si sumáramos los números de todos los compartimentos donde cayeron tus pelotas y lo dividiéramos equitativamente entre las {stats.n} pelotas, cada una tendría un valor medio de{' '}
            <span className="text-amber-300 font-bold font-mono">{stats.mean.toFixed(2)}</span>.
          </p>
          <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
            💡 <em>Interpretación:</em> El punto de equilibrio físico y teórico de la pirámide de Galton es 5.0. Tu media resultarte fue{' '}
            {Math.abs(stats.mean - 5.0) < 0.3
              ? 'extremadamente cercana al centro teórico.'
              : stats.mean > 5.0
              ? 'ligeramente desviada hacia la derecha.'
              : 'ligeramente desviada hacia la izquierda.'}
          </div>
        </div>

        {/* 2. MEDIANA (VALOR CENTRAL) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-emerald-300 flex items-center space-x-1.5">
              <span className="p-1 bg-emerald-500/20 rounded text-emerald-400">📐</span>
              <span>2. Mediana (Me) = {stats.median.toFixed(2)}</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Percentil 50
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            <strong className="text-emerald-300">En tus {stats.n} lanzamientos:</strong> Si ordenáramos todas tus pelotas en una fila de la menor a la mayor, la pelota que queda exactamente en la mitad de la fila aterrizó en la{' '}
            <span className="text-emerald-300 font-bold font-mono">Caja {stats.median.toFixed(2)}</span>.
          </p>
          <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
            💡 <em>Interpretación: Exactamente el 50% de tus pelotas cayeron en la Caja {Math.floor(stats.median)} o inferior, y el otro 50% cayó en cajas superiores.</em>
          </div>
        </div>

        {/* 3. MODA (MAYOR FRECUENCIA) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-purple-300 flex items-center space-x-1.5">
              <span className="p-1 bg-purple-500/20 rounded text-purple-400">🔥</span>
              <span>3. Moda (Mo) = Caja {stats.mode.join(', ')}</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Valor Más Popular
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            <strong className="text-purple-300">En tus {stats.n} lanzamientos:</strong> El compartimento{' '}
            <span className="text-purple-300 font-bold font-mono">Caja {stats.mode.join(', ')}</span> apareció{' '}
            <span className="text-purple-300 font-bold font-mono">{maxFreq} veces</span>. Por eso fue la moda de esta ronda.
          </p>
          <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
            💡 <em>Interpretación: Es el resultado más probable en una distribución de campana de Gauss, ya que existen más caminos físicos posibles que conducen al centro.</em>
          </div>
        </div>

        {/* 4. RANGO (DISPERSIÓN) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-blue-300 flex items-center space-x-1.5">
              <span className="p-1 bg-blue-500/20 rounded text-blue-400">↔️</span>
              <span>4. Rango = {stats.range} compartimentos</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Amplitud Total
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            <strong className="text-blue-300">En tus {stats.n} lanzamientos:</strong> La pelota más a la izquierda cayó en la Caja{' '}
            <span className="text-blue-300 font-bold font-mono">{minLanded}</span> y la más a la derecha cayó en la Caja{' '}
            <span className="text-blue-300 font-bold font-mono">{maxLanded}</span>. La diferencia entre el máximo y mínimo fue de{' '}
            <span className="text-blue-300 font-bold font-mono">{stats.range}</span>.
          </p>
          <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
            💡 <em>Interpretación: Un rango más amplio indica mayor dispersión de datos. A mayor número de pelotas, mayor probabilidad de tocar cajas extremas (0 y 10).</em>
          </div>
        </div>
      </div>
    </div>
  );
};
