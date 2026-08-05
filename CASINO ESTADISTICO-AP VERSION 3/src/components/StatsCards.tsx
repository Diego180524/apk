import React from 'react';
import { DescriptiveStats } from '../types/plinko';
import {
  Hash,
  Calculator,
  AlignJustify,
  Flame,
  ArrowDownToLine,
  ArrowUpFromLine,
  Maximize2,
  TrendingUp,
  Activity,
  Percent,
} from 'lucide-react';

interface StatsCardsProps {
  stats: DescriptiveStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Muestra (n)',
      value: stats.n.toString(),
      subtext: 'Pelotas totales',
      icon: Hash,
      color: 'from-amber-400 to-yellow-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-amber-300',
      borderColor: 'border-amber-500/30',
    },
    {
      title: 'Media (x̄)',
      value: stats.n > 0 ? stats.mean.toFixed(2) : '0.00',
      subtext: 'Centro ponderado',
      icon: Calculator,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Mediana (Me)',
      value: stats.n > 0 ? stats.median.toFixed(2) : '0.00',
      subtext: 'Valor del medio',
      icon: AlignJustify,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'Moda (Mo)',
      value: stats.n > 0 && stats.mode.length > 0 ? stats.mode.join(', ') : 'N/A',
      subtext:
        stats.modeType === 'unimodal'
          ? 'Unimodal'
          : stats.modeType === 'bimodal'
          ? 'Bimodal'
          : stats.modeType === 'multimodal'
          ? 'Multimodal'
          : 'Sin moda',
      icon: Flame,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-rose-300',
      borderColor: 'border-rose-500/30',
    },
    {
      title: 'Mínimo (Min)',
      value: stats.n > 0 ? stats.min.toString() : '0',
      subtext: 'Caja inferior',
      icon: ArrowDownToLine,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'Máximo (Max)',
      value: stats.n > 0 ? stats.max.toString() : '0',
      subtext: 'Caja superior',
      icon: ArrowUpFromLine,
      color: 'from-sky-500 to-cyan-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-sky-300',
      borderColor: 'border-sky-500/30',
    },
    {
      title: 'Rango (R)',
      value: stats.n > 0 ? stats.range.toString() : '0',
      subtext: 'Max - Min',
      icon: Maximize2,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-violet-300',
      borderColor: 'border-violet-500/30',
    },
    {
      title: 'Varianza (s²)',
      value: stats.n > 1 ? stats.varianceSample.toFixed(3) : '0.000',
      subtext: 'Varianza muestral',
      icon: TrendingUp,
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-yellow-300',
      borderColor: 'border-amber-500/30',
    },
    {
      title: 'Desviación estándar (s)',
      value: stats.n > 1 ? stats.stdDevSample.toFixed(3) : '0.000',
      subtext: 'Dispersión (√s²)',
      icon: Activity,
      color: 'from-fuchsia-500 to-purple-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-fuchsia-300',
      borderColor: 'border-fuchsia-500/30',
    },
    {
      title: 'Coeficiente Variación (CV)',
      value: stats.n > 0 ? `${stats.cv.toFixed(1)}%` : '0.0%',
      subtext: '(s / x̄) * 100',
      icon: Percent,
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-slate-900',
      textColor: 'text-teal-300',
      borderColor: 'border-teal-500/30',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-black text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/50" />
          <span>Resumen de Medidas Estadísticas Descriptivas</span>
        </h2>
        <span className="text-xs text-amber-400 font-bold bg-slate-900 px-3 py-1 rounded-full border border-amber-500/30 shadow-md">
          Muestra total (n = {stats.n})
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl ${card.bgColor} border ${card.borderColor} shadow-xl transition-all duration-200 hover:scale-[1.02] hover:border-amber-400/50 flex flex-col justify-between text-white relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 truncate mr-1">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-xl bg-gradient-to-tr ${card.color} text-slate-950 font-bold shadow-md`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-1">
                <div className={`text-xl sm:text-2xl font-black ${card.textColor} tracking-tight font-mono`}>
                  {card.value}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                  {card.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

