import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../../types';
import { playSound } from '../../utils/audio';

interface SceneFinalChallengeProps {
  onComplete: () => void;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'En el grupo de datos de las iguanas [12, 14, 13, 15, 14, 13, 80], ¿cuál de los siguientes es el VALOR ATÍPICO?',
    options: ['12', '14', '80', '13'],
    correctIndex: 2,
    explanation: '¡Excelente! El 80 se aleja drásticamente de los demás valores (que están entre 12 y 15).',
  },
  {
    id: 2,
    question: 'Si ordenamos los datos de menor a mayor [12, 13, 13, 14, 14, 15, 80], ¿cuál es la MEDIANA (el centro exacto)?',
    options: ['13', '14', '15', '80'],
    correctIndex: 1,
    explanation: '¡Muy bien! El número 14 ocupa la posición central en la lista ordenada.',
  },
  {
    id: 3,
    question: '¿Qué gráfico utilizarías para comparar rápidamente las diferentes actividades del Malecón 2000?',
    options: ['Gráfico de Barras', 'Gráfico de Dispersión', 'Diagrama de Caja', 'Histograma'],
    correctIndex: 0,
    explanation: '¡Exacto! El Gráfico de Barras es ideal para comparar categorías directamente.',
  },
  {
    id: 4,
    question: '¿Qué gráfico usarías para observar si existe una relación entre la distancia (km) y el tiempo (min) usando solo puntos?',
    options: ['Gráfico Circular', 'Gráfico de Dispersión (Scatter)', 'Tabla de Frecuencias', 'Histograma'],
    correctIndex: 1,
    explanation: '¡Perfecto! El Gráfico de Dispersión permite evaluar relaciones entre dos variables numéricas.',
  },
];

export const SceneFinalChallenge: React.FC<SceneFinalChallengeProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOpt(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      playSound.foundOutlier();
      setScore(score + 1);
    } else {
      playSound.click();
    }
  };

  const handleNextQuestion = () => {
    playSound.click();
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Banner */}
      <div className="max-w-3xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase mb-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          RETO FINAL DE LECTURA DE DATOS
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          YA SABES LO BÁSICO. AHORA VEÁMOS SI PUEDES LEER LOS DATOS.
        </h2>
        <p className="text-slate-300 text-sm mt-1 font-medium">
          Pregunta {currentIdx + 1} de {QUESTIONS.length}
        </p>
      </div>

      {/* Question Card */}
      <div className="max-w-3xl mx-auto w-full bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl my-auto">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-6 leading-snug">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = idx === currentQ.correctIndex;
            const isSelected = selectedOpt === idx;

            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500 text-slate-950 border-emerald-300 font-black scale-102 shadow-lg shadow-emerald-500/30';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
              } else {
                btnStyle = 'bg-slate-950 border-slate-800 text-slate-600 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                id={`challenge-opt-${idx}`}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl font-bold text-base text-left border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-slate-950" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {/* Feedback explanation box */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 ${
                selectedOpt === currentQ.correctIndex
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
              }`}
            >
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>{currentQ.explanation}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Next Button */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
        <div className="text-xs font-bold text-emerald-400">
          Aciertos: {score} / {QUESTIONS.length}
        </div>

        <button
          id="challenge-next-btn"
          disabled={!isAnswered}
          onClick={handleNextQuestion}
          className={`px-8 py-3.5 rounded-2xl font-black text-base flex items-center gap-2 shadow-xl transition-all ${
            isAnswered
              ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 cursor-pointer active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <span>{currentIdx + 1 < QUESTIONS.length ? 'Siguiente Pregunta' : 'Ver Conclusión Final'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
