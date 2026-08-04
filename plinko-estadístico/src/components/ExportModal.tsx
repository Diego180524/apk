import React from 'react';
import { DescriptiveStats, FrequencyRow } from '../types/plinko';
import { exportToExcel } from '../utils/exportExcel';
import { exportToPdf } from '../utils/exportPdf';
import { X, FileSpreadsheet, FileText, CheckCircle2, Download } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 space-y-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-400/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Exportar Resultados</h3>
              <p className="text-xs text-blue-200">Muestra n = {stats.n} pelotas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600">
            Selecciona el formato de exportación para guardar la tabla de frecuencias, las medidas estadísticas y las interpretaciones del experimento Plinko:
          </p>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Excel Button */}
            <button
              onClick={handleExportExcel}
              className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 hover:border-emerald-500 text-left transition-all group flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                  .XLSX
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Libro de Excel
                </h4>
                <p className="text-[11px] text-emerald-700/80 mt-0.5">
                  Incluye 3 hojas: Resumen, Tabla de Frecuencias y Muestra Cruda.
                </p>
              </div>
            </button>

            {/* PDF Button */}
            <button
              onClick={handleExportPdf}
              className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 hover:border-purple-500 text-left transition-all group flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2.5 bg-purple-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  .PDF
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-purple-950">
                  Informe en PDF
                </h4>
                <p className="text-[11px] text-purple-700/80 mt-0.5">
                  Documento listo para imprimir o enviar con tablas e interpretación.
                </p>
              </div>
            </button>
          </div>

          {/* Data Summary Checklist */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="font-semibold text-slate-800 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Datos incluidos en la exportación:</span>
            </div>
            <ul className="grid grid-cols-2 gap-1 text-[11px] pl-5 list-disc text-slate-500">
              <li>10 Medidas Estadísticas</li>
              <li>Tabla de Frecuencias fᵢ, hᵢ, pᵢ</li>
              <li>Frecuencias Acumuladas Fᵢ</li>
              <li>Probabilidades B(10, 0.5)</li>
              <li>Muestra Cruda ({stats.n} datos)</li>
              <li>Interpretación Automática</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
