import React, { useState } from 'react';
import { FrequencyRow } from '../types/plinko';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Layers } from 'lucide-react';

interface ChartsSectionProps {
  freqTable: FrequencyRow[];
  n: number;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ freqTable, n }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'histogram' | 'bar' | 'polygon' | 'pie'>('all');

  const chartData = freqTable.map((r) => ({
    name: `Caja ${r.bin}`,
    bin: r.bin,
    'Frecuencia Absoluta (fᵢ)': r.absFreq,
    'Frecuencia Relativa (%)': Number(r.percentFreq.toFixed(1)),
    'Teórica Esperada (n·P)': Number(r.theoreticalFreq.toFixed(1)),
    'Frecuencia Acumulada': r.cumAbsFreq,
  }));

  // Colors for Pie Chart
  const PIE_COLORS = [
    '#1E40AF',
    '#2563EB',
    '#3B82F6',
    '#60A5FA',
    '#93C5FD',
    '#8B5CF6',
    '#A855F7',
    '#C084FC',
    '#E879F9',
    '#F472B6',
    '#FB7185',
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 space-y-4">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Visualización Gráfica
            </h3>
            <p className="text-xs text-slate-500">
              Representaciones estadísticas del experimento
            </p>
          </div>
        </div>

        {/* Chart Selector Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            Ver Todos
          </button>
          <button
            onClick={() => setActiveTab('histogram')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'histogram'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            1. Histograma
          </button>
          <button
            onClick={() => setActiveTab('bar')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            2. Barras
          </button>
          <button
            onClick={() => setActiveTab('polygon')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'polygon'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            3. Polígono
          </button>
          <button
            onClick={() => setActiveTab('pie')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'pie'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            4. Circular (Pie)
          </button>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className={`grid gap-5 ${activeTab === 'all' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* 1. HISTOGRAMA */}
        {(activeTab === 'all' || activeTab === 'histogram') && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5 text-blue-900">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>1. Histograma de Frecuencias (Con Teórica Overlay)</span>
              </span>
              <span className="text-slate-400 font-medium">Empírica vs. Teórica</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Area
                    type="monotone"
                    dataKey="Frecuencia Absoluta (fᵢ)"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={0.5}
                    barSize={30}
                  />
                  <Area
                    type="monotone"
                    dataKey="Teórica Esperada (n·P)"
                    stroke="#9333EA"
                    fill="#A855F7"
                    fillOpacity={0.2}
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2. GRÁFICO DE BARRAS */}
        {(activeTab === 'all' || activeTab === 'bar') && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5 text-indigo-900">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>2. Gráfico de Barras Comparativo (Observado vs. Esperado)</span>
              </span>
              <span className="text-slate-400 font-medium">Categorías 0..10</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="Frecuencia Absoluta (fᵢ)" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Teórica Esperada (n·P)" fill="#C084FC" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. POLÍGONO DE FRECUENCIAS */}
        {(activeTab === 'all' || activeTab === 'polygon') && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5 text-purple-900">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>3. Polígono de Frecuencias (Marcas de Clase)</span>
              </span>
              <span className="text-slate-400 font-medium">Tendencia Continua</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Line
                    type="monotone"
                    dataKey="Frecuencia Absoluta (fᵢ)"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#6D28D9' }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Teórica Esperada (n·P)"
                    stroke="#2563EB"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: '#2563EB' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 4. GRÁFICO CIRCULAR (PIE CHART) */}
        {(activeTab === 'all' || activeTab === 'pie') && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5 text-pink-900">
                <PieIcon className="w-4 h-4 text-pink-600" />
                <span>4. Gráfico Circular (Proporciones Porcentuales)</span>
              </span>
              <span className="text-slate-400 font-medium">% por compartimento</span>
            </div>
            <div className="h-64 w-full">
              {n > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.filter((d) => d['Frecuencia Absoluta (fᵢ)'] > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="Frecuencia Absoluta (fᵢ)"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                  Lanza pelotas para ver la distribución porcentual
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
