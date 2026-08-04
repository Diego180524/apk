import React from 'react';
import { DescriptiveStats, FrequencyRow } from '../types/plinko';
import { exportToExcel } from '../utils/exportExcel';
import { exportToPdf } from '../utils/exportPdf';
import { X, FileSpreadsheet, FileText, CheckCircle2, Download, Crown } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DescriptiveStats;
  freqTable: FrequencyRow[];
  rawData: number[];
  interpretation: { summary: string; details: string[] };
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  stats,
  freqTable,
  rawData,
  interpretation,
}) => {
  if (!isOpen) return null;

  const handleExportExcel = () => {
    exportToExcel(stats, freqTable, rawData, interpretation);
  };

  const handleExportPdf = () => {
    exportToPdf(stats, freqTable, interpretation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-amber-500/40 overflow-hidden text-slate-100 space-y-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-950 text-white p-4 px-6 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-400/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-amber-300 flex items-center space-x-1.5">
                <span>Exportar Informe VIP</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-amber-200/80">Muestra de n = {stats.n} datos simulados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-300">
            Selecciona el formato de exportación profesional para guardar la tabla de frecuencias, las medidas descriptivas y la interpretación estadística:
          </p>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Excel Button */}
            <button
              onClick={handleExportExcel}
              className="p-4 rounded-2xl bg-slate-950 hover:bg-emerald-950/40 border-2 border-emerald-500/40 hover:border-emerald-400 text-left transition-all group flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform shadow-md">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  .XLSX
                </span>
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-300">
                  Libro de Excel (.xlsx)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  3 hojas con Resumen, Frecuencias y Datos Crudos.
                </p>
              </div>
            </button>

            {/* PDF Button */}
            <button
              onClick={handleExportPdf}
              className="p-4 rounded-2xl bg-slate-950 hover:bg-amber-950/40 border-2 border-amber-500/40 hover:border-amber-400 text-left transition-all group flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl group-hover:scale-105 transition-transform shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  .PDF
                </span>
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-300">
                  Informe PDF Profesional
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Documento listo para entregar con tablas e interpretación.
                </p>
              </div>
            </button>
          </div>

          {/* Data Summary Checklist */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
            <div className="font-extrabold text-amber-300 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Contenido del Reporte Exportado:</span>
            </div>
            <ul className="grid grid-cols-2 gap-1 text-[11px] pl-5 list-disc text-slate-400">
              <li>10 Medidas Estadísticas</li>
              <li>Tabla de Frecuencias fᵢ, hᵢ, pᵢ</li>
              <li>Frecuencias Acumuladas Fᵢ</li>
              <li>Probabilidades B(10, p)</li>
              <li>Muestra Cruda ({stats.n} datos)</li>
              <li>Interpretación Automática</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

