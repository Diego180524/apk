import React from 'react';
import { X, BookOpen, Lightbulb, GraduationCap, CheckCircle, Crown } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-amber-500/40 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white p-4 px-6 flex items-center justify-between flex-shrink-0 border-b border-amber-500/30">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-400/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-amber-300 flex items-center space-x-1.5">
                <span>Fundamento Teórico & Estadístico</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-indigo-200">El Gran Casino Estadístico - Tablero de Galton</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-amber-300 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>1. ¿Qué es el Tablero de Galton / Plinko?</span>
            </h4>
            <p>
              El experimento de Plinko es la versión física moderna del <strong>Tablero de Galton</strong>, inventado por Sir Francis Galton en 1889. Muestra cómo la combinación de múltiples sucesos aleatorios independientes genera una curva de distribución normal.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-sm font-black text-emerald-400 flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span>2. La Distribución Binomial B(10, p)</span>
            </h4>
            <p>
              En este tablero con <strong>10 niveles de clavijas</strong>, cada pelota toma una decisión binaria e independiente en cada nivel: desviarse a la izquierda (Éxito = 0) o a la derecha (Éxito = 1) con probabilidad <code>p</code>.
            </p>
            <div className="bg-slate-900 p-3 rounded-lg font-mono text-[11px] text-amber-300 border border-amber-500/30">
              P(X = k) = C(10, k) × pᵏ × (1-p)¹⁰⁻ᵏ
            </div>
            <p>
              Donde <code>k</code> es el número del compartimento inferior (0 a 10). Para <code>p = 0.5</code>, la media teórica esperada es <code>μ = n · p = 10 · 0.5 = 5</code> y la varianza es <code>σ² = n · p · (1-p) = 2.5</code>.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-sky-300 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-sky-400" />
              <span>3. Ley de los Grandes Números y Teorema del Límite Central</span>
            </h4>
            <p>
              A medida que lanzas más pelotas (por ejemplo, al presionar "Lanzar 50 Pelotas" de forma acumulada hasta n = 200 o más):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong>Frecuencia Relativa:</strong> La proporción observada (hᵢ = fᵢ/n) converge de forma exacta a la probabilidad binomial teórica P(X = k).
              </li>
              <li>
                <strong>Campana de Gauss:</strong> El histograma discreto de la binomial B(10, 0.5) se aproxima de forma casi perfecta a una distribución continua Normal N(μ=5, σ²=2.5).
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-sm font-black text-amber-400">
              4. Fórmulas de Estadística Descriptiva Implementadas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-amber-300">Media (x̄):</span> Σxᵢ / n
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-amber-300">Varianza Muestral (s²):</span> Σ(xᵢ - x̄)² / (n - 1)
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-amber-300">Desv. Estándar (s):</span> √s²
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-amber-300">Coef. Variación (CV):</span> (s / x̄) × 100%
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 text-right flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

