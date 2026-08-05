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

  // Casino Vibrant Color Palette for Pie Chart
  const CASINO_COLORS = [
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#38BDF8', // Electric Blue
    '#A855F7', // Violet
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#EAB308', // Gold
    '#06B6D4', // Cyan
    '#8B5CF6', // Purple
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-amber-500/30 text-white space-y-4">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-amber-300 uppercase tracking-wide">
              Visualización Gráfica del Casino
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Representaciones estadísticas e histogramas en tiempo real
            </p>
          </div>
        </div>

        {/* Chart Selector Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl text-xs font-bold border border-slate-800">
          {[
            { id: 'all', label: 'Ver Todos' },
            { id: 'histogram', label: '1. Histograma' },
            { id: 'bar', label: '2. Barras' },
            { id: 'polygon', label: '3. Polígono' },
            { id: 'pie', label: '4. Circular' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Charts */}
      <div className={`grid gap-5 ${activeTab === 'all' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* 1. HISTOGRAMA */}
        {(activeTab === 'all' || activeTab === 'histogram') && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-amber-400">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span>1. Histograma de Frecuencias (Observada vs Teórica)</span>
              </span>
              <span className="text-slate-400 font-medium">Campana B(10, p)</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#f59e0b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Area
                    type="monotone"
                    dataKey="Frecuencia Absoluta (fᵢ)"
                    stroke="#F59E0B"
                    fill="#FBBF24"
                    fillOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="Teórica Esperada (n·P)"
                    stroke="#A855F7"
                    fill="#C084FC"
                    fillOpacity={0.15}
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2. GRÁFICO DE BARRAS */}
        {(activeTab === 'all' || activeTab === 'bar') && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>2. Diagrama de Barras Comparativo</span>
              </span>
              <span className="text-slate-400 font-medium">Cajas 0 a 10</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="Frecuencia Absoluta (fᵢ)" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Teórica Esperada (n·P)" fill="#38BDF8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. POLÍGONO DE FRECUENCIAS */}
        {(activeTab === 'all' || activeTab === 'polygon') && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-sky-400">
                <TrendingUp className="w-4 h-4 text-sky-500" />
                <span>3. Polígono de Frecuencias</span>
              </span>
              <span className="text-slate-400 font-medium">Tendencia Suave</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#38bdf8',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Line
                    type="monotone"
                    dataKey="Frecuencia Absoluta (fᵢ)"
                    stroke="#38BDF8"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#0284C7' }}
                    activeDot={{ r: 8, fill: '#FBBF24' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Teórica Esperada (n·P)"
                    stroke="#A855F7"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: '#A855F7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 4. GRÁFICO CIRCULAR (PIE CHART) */}
        {(activeTab === 'all' || activeTab === 'pie') && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-pink-400">
                <PieIcon className="w-4 h-4 text-pink-500" />
                <span>4. Gráfico Circular (Porcentajes)</span>
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
                        <Cell
                          key={`cell-${index}`}
                          fill={CASINO_COLORS[index % CASINO_COLORS.length]}
                          stroke="#020617"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#020617',
                        borderColor: '#ec4899',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
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

