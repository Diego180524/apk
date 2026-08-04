import React from 'react';
import { StatisticalInterpretation } from '../types/plinko';
import {
  Sparkles,
  Download,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  Gauge,
  BarChart2,
} from 'lucide-react';

interface InterpretationCardProps {
  interpretation: StatisticalInterpretation;
  onOpenExportModal: () => void;
  n: number;
}

export const InterpretationCard: React.FC<InterpretationCardProps> = ({
  interpretation,
  onOpenExportModal,
  n,
}) => {
  const {
    summary,
    details,
    shapeClassification,
    dispersionClassification,
    learnedConclusion,
    trivia,
  } = interpretation;

  // Badge styles based on shape classification
  const getShapeBadgeStyle = (shape: string) => {
    switch (shape) {
      case 'Simétrica':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
      case 'Sesgada a la derecha':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40';
      case 'Sesgada a la izquierda':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
    }
  };

  // Badge styles for dispersion classification
  const getDispersionBadgeStyle = (disp: string) => {
    switch (disp) {
      case 'Poco dispersa':
        return 'bg-sky-500/20 text-sky-300 border-sky-400/40';
      case 'Muy dispersa':
        return 'bg-rose-500/20 text-rose-300 border-rose-400/40';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Container: Interpretación Estadística Automática */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 shadow-2xl border border-amber-500/30 space-y-4 relative overflow-hidden">
        {/* Decorative Casino Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/80 pb-3 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide text-white uppercase">
                Análisis Estadístico Descriptivo
              </h3>
              <p className="text-xs text-amber-300/90 font-medium">
                Análisis descriptivo basado en datos simulados
              </p>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={onOpenExportModal}
            disabled={n === 0}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white shadow-lg shadow-emerald-950/40 border border-emerald-300/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Informe</span>
          </button>
        </div>

        {/* Status Indicators Badges */}
        <div className="flex flex-wrap gap-2.5 relative z-10">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border flex items-center space-x-1.5 ${getShapeBadgeStyle(shapeClassification)}`}>
            <BarChart2 className="w-4 h-4" />
            <span>Forma: {shapeClassification}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border flex items-center space-x-1.5 ${getDispersionBadgeStyle(dispersionClassification)}`}>
            <Gauge className="w-4 h-4" />
            <span>Variabilidad: {dispersionClassification}</span>
          </div>
        </div>

        {/* Main Dynamic Interpretation Box */}
        <div className="bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-amber-500/20 space-y-3 relative z-10 shadow-inner">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 p-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-sm sm:text-base font-medium text-amber-100 leading-relaxed">
              "{summary}"
            </p>
          </div>

          {/* Detailed Points */}
          {details.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-200">
              <h4 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                Detalles del Comportamiento Observado:
              </h4>
              <ul className="space-y-2">
                {details.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Grid: ¿Qué aprendimos de esta simulación? & Curiosidad Estadística */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section: ¿Qué aprendimos de esta simulación? */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-5 rounded-2xl border border-purple-500/30 text-white shadow-xl space-y-3">
          <div className="flex items-center space-x-2.5 border-b border-purple-800/60 pb-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <GraduationCap className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                ¿Qué aprendimos de esta simulación?
              </h4>
              <p className="text-[11px] text-purple-200/70">
                Conclusión educativa para estudiantes
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed italic bg-purple-950/40 p-3.5 rounded-xl border border-purple-500/20">
            "{learnedConclusion}"
          </p>
        </div>

        {/* Panel: Curiosidad Estadística */}
        <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-yellow-950 p-5 rounded-2xl border border-amber-500/30 text-white shadow-xl space-y-3">
          <div className="flex items-center space-x-2.5 border-b border-amber-800/60 pb-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Lightbulb className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                Curiosidad Estadística
              </h4>
              <span className="text-[10px] font-semibold text-amber-200/70">
                {trivia.category}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/20">
            <h5 className="text-xs font-bold text-amber-200">
              {trivia.title}
            </h5>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              {trivia.fact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

