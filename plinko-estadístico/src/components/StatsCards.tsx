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
      title: 'Número de datos (n)',
      value: stats.n.toString(),
      subtext: 'Muestra total de pelotas',
      icon: Hash,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Media (x̄)',
      value: stats.n > 0 ? stats.mean.toFixed(2) : '0.00',
      subtext: 'Centro numérico ponderado',
      icon: Calculator,
      color: 'from-purple-600 to-indigo-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Mediana (Me)',
      value: stats.n > 0 ? stats.median.toFixed(2) : '0.00',
      subtext: 'Valor central (Percentil 50)',
      icon: AlignJustify,
      color: 'from-indigo-600 to-blue-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200',
    },
    {
      title: 'Moda (Mo)',
      value: stats.n > 0 && stats.mode.length > 0 ? stats.mode.join(', ') : 'N/A',
      subtext: stats.modeType === 'unimodal' ? 'Unimodal' : stats.modeType === 'bimodal' ? 'Bimodal' : stats.modeType === 'multimodal' ? 'Multimodal' : 'Sin moda',
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Mínimo (Min)',
      value: stats.n > 0 ? stats.min.toString() : '0',
      subtext: 'Caja inferior observada',
      icon: ArrowDownToLine,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Máximo (Max)',
      value: stats.n > 0 ? stats.max.toString() : '0',
      subtext: 'Caja superior observada',
      icon: ArrowUpFromLine,
      color: 'from-sky-600 to-cyan-600',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700',
      borderColor: 'border-sky-200',
    },
    {
      title: 'Rango (R)',
      value: stats.n > 0 ? stats.range.toString() : '0',
      subtext: 'Max - Min',
      icon: Maximize2,
      color: 'from-violet-600 to-purple-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      borderColor: 'border-violet-200',
    },
    {
      title: 'Varianza (s²)',
      value: stats.n > 1 ? stats.varianceSample.toFixed(3) : '0.000',
      subtext: 'Varianza muestral',
      icon: TrendingUp,
      color: 'from-rose-600 to-pink-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-200',
    },
    {
      title: 'Desviación estándar (s)',
      value: stats.n > 1 ? stats.stdDevSample.toFixed(3) : '0.000',
      subtext: 'Dispersión absoluta (√s²)',
      icon: Activity,
      color: 'from-fuchsia-600 to-purple-600',
      bgColor: 'bg-fuchsia-50',
      textColor: 'text-fuchsia-700',
      borderColor: 'border-fuchsia-200',
    },
    {
      title: 'Coeficiente de variación (CV)',
      value: stats.n > 0 ? `${stats.cv.toFixed(1)}%` : '0.0%',
      subtext: '(s / x̄) * 100',
      icon: Percent,
      color: 'from-blue-700 to-purple-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
          <span>ESTADÍSTICA DESCRIPTIVA</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          Muestra (n = {stats.n})
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl ${card.bgColor} border ${card.borderColor} shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 truncate mr-1">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-xs`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-1">
                <div className={`text-xl sm:text-2xl font-black ${card.textColor} tracking-tight font-mono`}>
                  {card.value}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
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
