import React from 'react';
import { FrequencyRow } from '../types/plinko';
import { Table, Info } from 'lucide-react';

interface FrequencyTableProps {
  freqTable: FrequencyRow[];
  n: number;
}

export const FrequencyTable: React.FC<FrequencyTableProps> = ({ freqTable, n }) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Tabla de Frecuencias Ordenada
            </h3>
            <p className="text-xs text-slate-500">
              Distribución observada (empírica) vs. Probabilidad Binomial B(10, 0.5) teórica
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
          <Info className="w-4 h-4" />
          <span>Fórmulas: hᵢ = fᵢ/n | pᵢ = hᵢ × 100</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
        <table className="w-full text-left text-xs text-slate-700 border-collapse min-w-[650px]">
          <thead className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-semibold">
            <tr>
              <th className="py-3 px-3.5 text-center rounded-tl-xl">Caja (x)</th>
              <th className="py-3 px-3.5 text-center">Frec. Absoluta (fᵢ)</th>
              <th className="py-3 px-3.5 text-center">Frec. Relativa (hᵢ)</th>
              <th className="py-3 px-3.5 text-center">Frec. Porcentual (pᵢ)</th>
              <th className="py-3 px-3.5 text-center">Frec. Acumulada (Fᵢ)</th>
              <th className="py-3 px-3.5 text-center">Prob. Teórica P(X)</th>
              <th className="py-3 px-3.5 text-center rounded-tr-xl">Esperado (n · P)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {freqTable.map((row) => {
              const isCenterBin = row.bin === 5;
              const hasData = row.absFreq > 0;

              return (
                <tr
                  key={row.bin}
                  className={`transition-colors hover:bg-purple-50/60 ${
                    isCenterBin
                      ? 'bg-blue-50/40 font-semibold'
                      : row.bin % 2 === 0
                      ? 'bg-slate-50/50'
                      : 'bg-white'
                  }`}
                >
                  <td className="py-2.5 px-3.5 text-center font-bold text-indigo-900 font-sans">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs">
                      {row.bin}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-bold text-slate-900">
                    {row.absFreq}
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-slate-600">
                    {row.relFreq.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-bold text-purple-700">
                    {row.percentFreq.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-slate-600">
                    {row.cumAbsFreq}
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-blue-700 font-sans text-[11px]">
                    {(row.theoreticalProb * 100).toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-slate-500 font-sans text-[11px]">
                    {row.theoreticalFreq.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-300">
            <tr>
              <td className="py-3 px-3.5 text-center font-sans">TOTAL (Σ)</td>
              <td className="py-3 px-3.5 text-center font-mono text-indigo-900">{n}</td>
              <td className="py-3 px-3.5 text-center font-mono">{n > 0 ? '1.0000' : '0.0000'}</td>
              <td className="py-3 px-3.5 text-center font-mono text-purple-800">
                {n > 0 ? '100.0%' : '0.0%'}
              </td>
              <td className="py-3 px-3.5 text-center font-mono">{n}</td>
              <td className="py-3 px-3.5 text-center font-sans text-[11px] text-blue-800">100.0%</td>
              <td className="py-3 px-3.5 text-center font-sans text-[11px] text-slate-700">{n}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
