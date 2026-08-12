import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  ScatterChart as ScatterIcon,
  Table as TableIcon,
  BoxSelect,
  CircleDot,
  ArrowRight,
  Info,
} from 'lucide-react';
import { CollectedData } from '../../types';
import { playSound } from '../../utils/audio';

interface SceneChartsProps {
  collectedData: CollectedData;
  onProceedToChallenge: () => void;
}

type ChartTab = 'barras' | 'histograma' | 'puntos' | 'caja' | 'dispersion' | 'circular' | 'frecuencias';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const SceneCharts: React.FC<SceneChartsProps> = ({ collectedData, onProceedToChallenge }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('barras');

  // Prepare Bar Chart Data (Malecon Activities)
  const barData = collectedData.maleconActivities.map((act) => ({
    name: act.name,
    minutos: act.minutes,
  }));

  // Prepare Histogram Data (Route transit times grouped into bins)
  const histogramData = [
    { bin: '5-10 min', cantidad: collectedData.rutaTimes.filter((t) => t >= 5 && t <= 10).length },
    { bin: '11-15 min', cantidad: collectedData.rutaTimes.filter((t) => t >= 11 && t <= 15).length },
    { bin: '16-20 min', cantidad: collectedData.rutaTimes.filter((t) => t >= 16 && t <= 20).length },
    { bin: '21-25 min', cantidad: collectedData.rutaTimes.filter((t) => t >= 21 && t <= 25).length },
  ];

  // Prepare Scatter Plot Data (Distance km vs Transit time min in Guayaquil)
  const scatterPlotPoints = [
    { x: 1.8, y: 10, label: 'Las Peñas' },
    { x: 2.5, y: 15, label: 'Puerto Santa Ana' },
    { x: 3.2, y: 20, label: 'Parque Seminario' },
    { x: 4.1, y: 25, label: 'Malecón del Salado' },
    { x: 5.0, y: 30, label: 'Urdesa' },
  ];

  // Frequency Table Data for Iguana dataset
  const freqMap: Record<number, number> = {};
  collectedData.iguanaValues.forEach((val) => {
    freqMap[val] = (freqMap[val] || 0) + 1;
  });
  const totalObs = collectedData.iguanaValues.length || 1;
  const freqTableData = Object.keys(freqMap).map((kStr) => {
    const k = Number(kStr);
    const abs = freqMap[k];
    const rel = ((abs / totalObs) * 100).toFixed(1);
    return { valor: k, abs, rel: `${rel}%` };
  });

  const handleTabChange = (tab: ChartTab) => {
    playSound.click();
    setActiveTab(tab);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Banner */}
      <div className="max-w-5xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase mb-2">
          Sección de Visualización
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">AHORA VEÁMOSLO</h2>
        <p className="text-slate-300 text-sm sm:text-base mt-1 font-medium">
          Transformamos los datos recopilados en misiones a sus correspondientes gráficos descriptivos.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-5xl mx-auto w-full my-4 flex flex-wrap justify-center gap-2">
        <button
          id="chart-tab-barras"
          onClick={() => handleTabChange('barras')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'barras'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Barras</span>
        </button>

        <button
          id="chart-tab-histograma"
          onClick={() => handleTabChange('histograma')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'histograma'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Histograma</span>
        </button>

        <button
          id="chart-tab-puntos"
          onClick={() => handleTabChange('puntos')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'puntos'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <CircleDot className="w-4 h-4" />
          <span>Gráfico de Puntos</span>
        </button>

        <button
          id="chart-tab-caja"
          onClick={() => handleTabChange('caja')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'caja'
              ? 'bg-purple-500 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BoxSelect className="w-4 h-4" />
          <span>Diagrama de Caja</span>
        </button>

        <button
          id="chart-tab-dispersion"
          onClick={() => handleTabChange('dispersion')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'dispersion'
              ? 'bg-rose-500 text-white shadow-md font-black ring-2 ring-rose-400/40'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ScatterIcon className="w-4 h-4" />
          <span>Dispersión</span>
        </button>

        <button
          id="chart-tab-circular"
          onClick={() => handleTabChange('circular')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'circular'
              ? 'bg-orange-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <PieIcon className="w-4 h-4" />
          <span>Circular</span>
        </button>

        <button
          id="chart-tab-frecuencias"
          onClick={() => handleTabChange('frecuencias')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'frecuencias'
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Frecuencias</span>
        </button>
      </div>

      {/* Main Chart Viewer Card */}
      <div className="max-w-4xl mx-auto w-full bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl my-auto">
        {/* Short Human Explanation Callout */}
        <div className="mb-4 p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-cyan-200 text-xs sm:text-sm font-medium">
            {activeTab === 'barras' && 'GRÁFICO DE BARRAS: Sirve para comparar categorías rápidamente.'}
            {activeTab === 'histograma' &&
              'HISTOGRAMA: Aquí agrupamos números que están dentro de ciertos rangos para ver dónde se concentran.'}
            {activeTab === 'puntos' && 'GRÁFICO DE PUNTOS: Cada puntito representa una observación individual de tus datos.'}
            {activeTab === 'caja' &&
              'DIAGRAMA DE CAJA: Nos da una vista rápida de cómo están repartidos nuestros datos (cuartiles, mediana y atípicos).'}
            {activeTab === 'dispersion' &&
              'GRÁFICO DE DISPERSIÓN: Cada punto representa dos datos al mismo tiempo. Así podemos mirar si parecen tener alguna relación.'}
            {activeTab === 'circular' &&
              'GRÁFICO CIRCULAR: Permite observar fácilmente la proporción de cada categoría respecto al total.'}
            {activeTab === 'frecuencias' &&
              'TABLA DE FRECUENCIAS: Muestra ordenadamente cuántas veces aparece cada valor y su porcentaje.'}
          </p>
        </div>

        {/* Dynamic Chart Display Container */}
        <div className="h-[280px] sm:h-[320px] w-full flex items-center justify-center">
          {activeTab === 'barras' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '12px' }}
                />
                <Bar dataKey="minutos" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'histograma' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="bin" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', borderRadius: '12px' }}
                />
                <Bar dataKey="cantidad" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'puntos' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="text-xs text-amber-300 font-bold mb-4">Muestra de Tiempos Recolectados (Dot Plot)</div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {collectedData.iguanaValues.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-amber-200 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/30">
                      ●
                    </div>
                    <span className="text-xs font-bold text-slate-300">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'caja' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="text-xs text-purple-300 font-bold mb-6">Boxplot (Min: 12 | Q1: 13 | Mediana: 14 | Q3: 15 | Atípico: 80)</div>
              <div className="relative w-full max-w-lg h-16 bg-slate-900 border border-slate-700 rounded-xl flex items-center px-8">
                {/* Whisker Line */}
                <div className="absolute left-12 right-24 h-1 bg-purple-400" />
                {/* Box Q1 to Q3 */}
                <div className="absolute left-24 w-40 h-10 bg-purple-600/80 border-2 border-purple-300 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="w-1 h-full bg-white font-bold" />
                </div>
                {/* Outlier dot */}
                <div className="absolute right-6 w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xl animate-bounce">
                  80
                </div>
              </div>
            </div>
          )}

          {/* CRITICAL SCATTER PLOT RULE: Extremely clean! ONLY points, NO lines, NO connecting, NO 3D */}
          {activeTab === 'dispersion' && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Distancia"
                  unit=" km"
                  stroke="#94a3b8"
                  tick={{ fill: '#cbd5e1' }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Tiempo"
                  unit=" min"
                  stroke="#94a3b8"
                  tick={{ fill: '#cbd5e1' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#f43f5e', borderRadius: '12px' }}
                />
                <Scatter name="Rutas Guayaquil" data={scatterPlotPoints} fill="#f43f5e" />
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'circular' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={barData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="minutos"
                  label={({ name }) => name}
                >
                  {barData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#f97316', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'frecuencias' && (
            <div className="w-full h-full overflow-y-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-teal-400 font-bold">
                    <th className="py-2 px-3">Dato (Valor)</th>
                    <th className="py-2 px-3">Frecuencia Absoluta</th>
                    <th className="py-2 px-3">Frecuencia Relativa (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {freqTableData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-white">{row.valor}</td>
                      <td className="py-2.5 px-3 text-cyan-300 font-semibold">{row.abs}</td>
                      <td className="py-2.5 px-3 text-emerald-300 font-semibold">{row.rel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto w-full mt-4 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-slate-400 font-medium hidden sm:block">
          Siguiente: Demostrar lo aprendido en el Reto Final
        </p>

        <button
          id="charts-to-challenge-btn"
          onClick={onProceedToChallenge}
          className="w-full sm:w-auto ml-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <span>Ir al Reto Final</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
