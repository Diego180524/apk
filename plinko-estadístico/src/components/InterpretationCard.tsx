import React from 'react';
import { Sparkles, Download, CheckCircle2, ArrowRight } from 'lucide-react';

interface InterpretationCardProps {
  interpretation: {
    summary: string;
    details: string[];
    shape: 'bell' | 'right-skew' | 'left-skew' | 'uniform' | 'bimodal';
    recommendation: string;
  };
  onOpenExportModal: () => void;
  n: number;
}

export const InterpretationCard: React.FC<InterpretationCardProps> = ({
  interpretation,
  onOpenExportModal,
  n,
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-indigo-700/60 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
            <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              INTERPRETACIÓN ESTADÍSTICA AUTOMÁTICA
            </h3>
            <p className="text-xs text-indigo-200/80">
              Análisis descriptivo inteligente basado en los datos simulados
            </p>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          disabled={n === 0}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white shadow-lg shadow-emerald-900/30 border border-emerald-300/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Exportar resultados</span>
        </button>
      </div>

      {/* Main Highlights Card */}
      <div className="bg-slate-950/60 p-4 rounded-xl border border-indigo-500/30 space-y-3">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 p-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-sm sm:text-base font-semibold text-blue-100 leading-relaxed">
            "{interpretation.summary}"
          </p>
        </div>

        {/* Detailed Points */}
        {interpretation.details.length > 0 && (
          <ul className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
            {interpretation.details.map((detail, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold mt-0.5">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recommendation Box */}
      {interpretation.recommendation && (
        <div className="flex items-center space-x-2 text-xs bg-purple-950/40 p-3 rounded-xl border border-purple-500/30 text-purple-200">
          <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>{interpretation.recommendation}</span>
        </div>
      )}
    </div>
  );
};
