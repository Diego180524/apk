import React from 'react';
import { FrequencyRow } from '../types/plinko';
import { Table, Info, Crown } from 'lucide-react';

interface FrequencyTableProps {
  freqTable: FrequencyRow[];
  n: number;
}

export const FrequencyTable: React.FC<FrequencyTableProps> = ({ freqTable, n }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-amber-500/30 text-white space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Tabla de Frecuencias Profesional</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Comparativa empírica observada vs. Distribución Binomial teórica B(10, p)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 font-bold">
          <Info className="w-4 h-4 text-amber-400" />
          <span>Fórmulas: hᵢ = fᵢ / n | pᵢ = hᵢ × 100</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-2xl">
        <table className="w-full text-left text-xs text-slate-200 border-collapse min-w-[650px]">
          <thead className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-slate-950 font-extrabold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-3.5 text-center">Caja (x)</th>
              <th className="py-3 px-3.5 text-center">Frec. Absoluta (fᵢ)</th>
              <th className="py-3 px-3.5 text-center">Frec. Relativa (hᵢ)</th>
              <th className="py-3 px-3.5 text-center">Porcentual (pᵢ)</th>
              <th className="py-3 px-3.5 text-center">Acumulada (Fᵢ)</th>
              <th className="py-3 px-3.5 text-center">Prob. Teórica P(X)</th>
              <th className="py-3 px-3.5 text-center">Esperado (n · P)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {freqTable.map((row) => {
              const isCenterBin = row.bin === 5;

              return (
                <tr
                  key={row.bin}
                  className={`transition-colors hover:bg-amber-500/10 ${
                    isCenterBin
                      ? 'bg-amber-950/40 font-bold'
                      : row.bin % 2 === 0
                      ? 'bg-slate-950/60'
                      : 'bg-slate-900'
                  }`}
                >
                  <td className="py-2.5 px-3.5 text-center font-bold text-amber-300 font-sans">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs">
                      {row.bin}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-extrabold text-amber-400 text-sm">
                    {row.absFreq}
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-slate-300">
                    {row.relFreq.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3.5 text-center font-bold text-emerald-400">
                    {row.percentFreq.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-slate-300">
                    {row.cumAbsFreq}
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-sky-300 font-sans text-[11px]">
                    {(row.theoreticalProb * 100).toFixed(2)}%
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-slate-400 font-sans text-[11px]">
                    {row.theoreticalFreq.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-950 text-amber-300 font-extrabold border-t-2 border-amber-500/40">
            <tr>
              <td className="py-3 px-3.5 text-center font-sans">TOTAL (Σ)</td>
              <td className="py-3 px-3.5 text-center font-mono text-amber-400 text-sm">{n}</td>
              <td className="py-3 px-3.5 text-center font-mono">{n > 0 ? '1.0000' : '0.0000'}</td>
              <td className="py-3 px-3.5 text-center font-mono text-emerald-400">
                {n > 0 ? '100.0%' : '0.0%'}
              </td>
              <td className="py-3 px-3.5 text-center font-mono">{n}</td>
              <td className="py-3 px-3.5 text-center font-sans text-[11px] text-sky-400">100.0%</td>
              <td className="py-3 px-3.5 text-center font-sans text-[11px] text-slate-300">{n}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

