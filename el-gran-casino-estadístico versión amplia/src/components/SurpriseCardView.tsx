import React, { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, Shield, AlertTriangle, Gift, Target, HelpCircle } from 'lucide-react';

export type CardCategory = 'challenge' | 'joker' | 'trap' | 'reward';

export interface SurpriseCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  bonusText: string;
  category: CardCategory;
  isJoker?: boolean;
}

export const ALL_SURPRISE_CARDS: SurpriseCard[] = [
  // 1. DESAFÍOS (CHALLENGE)
  {
    id: 'c1',
    title: 'EL NÚMERO DE LA SUERTE',
    icon: '🎯',
    description: 'Predice cuál compartimento (0-10) tendrá la mayor frecuencia (la Moda).',
    bonusText: '+25 Fichas Bonus',
    category: 'challenge',
  },
  {
    id: 'c2',
    title: 'OBSERVADOR ESTADÍSTICO',
    icon: '📊',
    description: 'Observa la simulación y comprueba si la distribución tiende a una campana simétrica.',
    bonusText: '+20 Fichas Bonus',
    category: 'challenge',
  },
  {
    id: 'c3',
    title: 'MEDIA VS. MEDIANA',
    icon: '⚖️',
    description: 'Compara si el valor promedio (Media) coincide con la mediana del centro.',
    bonusText: '+20 Fichas Bonus',
    category: 'challenge',
  },
  {
    id: 'c4',
    title: 'DETECTIVE DE DATOS',
    icon: '🕵️',
    description: 'Identifica después del lanzamiento cuál fue el dato exacto con más apariciones.',
    bonusText: '+20 Fichas Bonus',
    category: 'challenge',
  },

  // 2. COMODINES (JOKER / ADVANTAGE)
  {
    id: 'j1',
    title: 'CAMBIO DE SUERTE',
    icon: '🃏',
    description: '¡Comodín! Te permite cambiar tu predicción inicial una vez antes del lanzamiento.',
    bonusText: '¡Ajusta tu Predicción!',
    category: 'joker',
    isJoker: true,
  },
  {
    id: 'j2',
    title: 'ESCUDO ESTADÍSTICO',
    icon: '🛡️',
    description: '¡Comodín de Protección! Si tu predicción falla, no perderás fichas esta ronda.',
    bonusText: 'Sin Penalización en Fallo',
    category: 'joker',
    isJoker: true,
  },
  {
    id: 'j3',
    title: 'DOBLE RECOMPENSA',
    icon: '💰',
    description: '¡Comodín de Recompensa! Si aciertas tu predicción, recibes el doble de fichas.',
    bonusText: 'Recompensa x2',
    category: 'joker',
    isJoker: true,
  },
  {
    id: 'j4',
    title: 'APUESTA SEGURA',
    icon: '🎯',
    description: 'Reduce la penalización a 0 fichas independientemente del resultado.',
    bonusText: 'Riesgo Cero',
    category: 'joker',
    isJoker: true,
  },

  // 3. TRAMPAS (TRAP - SURPRISING DIFICULTY)
  {
    id: 't1',
    title: 'TRAMPA ESTADÍSTICA',
    icon: '🕳️',
    description: '¡Cuidado! En esta ronda los comodines de cambio de predicción quedan deshabilitados.',
    bonusText: 'Efecto Fijado',
    category: 'trap',
  },
  {
    id: 't2',
    title: 'APUESTA ARRIESGADA',
    icon: '🎲',
    description: '¡Riesgo Aumentado! La recompensa por acertar sube a +35 fichas, pero si fallas pierdes 15 fichas.',
    bonusText: 'Alto Riesgo / Alta Recompensa',
    category: 'trap',
  },
  {
    id: 't3',
    title: 'CAMBIO INESPERADO',
    icon: '⚠️',
    description: '¡Sorpresa del azar! Tu intuición se pone a prueba obligándote a revisar tu decisión.',
    bonusText: 'Desafío de Reacción',
    category: 'trap',
  },

  // 4. RECOMPENSAS (REWARD)
  {
    id: 'r1',
    title: 'BONUS ESTADÍSTICO',
    icon: '⭐',
    description: '¡Felicidades! Ganas +15 fichas virtuales instantáneas solo por revelar esta carta.',
    bonusText: '+15 Fichas Instantáneas',
    category: 'reward',
  },
  {
    id: 'r2',
    title: 'FICHA EXTRA',
    icon: '🪙',
    description: 'Obtienes +10 fichas adicionales para ampliar tu margen de participación.',
    bonusText: '+10 Fichas Extra',
    category: 'reward',
  },
  {
    id: 'r3',
    title: 'PREMIO DOBLE',
    icon: '🏆',
    description: 'Completar los lanzamientos de esta ronda otorga puntos de logros adicionales.',
    bonusText: '+25 Puntos de Logro',
    category: 'reward',
  },
];

interface SurpriseCardViewProps {
  card: SurpriseCard;
  isRevealed: boolean;
  onRevealCard: () => void;
  isJokerUsed: boolean;
  onUseJoker: () => void;
  isSimulating: boolean;
  onDrawNewCard: () => void;
}

export const SurpriseCardView: React.FC<SurpriseCardViewProps> = ({
  card,
  isRevealed,
  onRevealCard,
  isJokerUsed,
  onUseJoker,
  isSimulating,
  onDrawNewCard,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleReveal = () => {
    if (isSimulating || isRevealed) return;
    setIsFlipping(true);
    setTimeout(() => {
      onRevealCard();
      setIsFlipping(false);
    }, 400);
  };

  const isJokerCard = card.category === 'joker' || card.isJoker;
  const isTrapCard = card.category === 'trap';
  const isRewardCard = card.category === 'reward';

  // Badge styling based on category
  let categoryBadge = 'DESAFÍO CASINO';
  let categoryColor = 'bg-amber-500/20 text-amber-300 border-amber-400/40';
  let cardBorder = 'border-amber-400';
  let cardBg = 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950';

  if (isJokerCard) {
    categoryBadge = '🃏 COMODÍN ESPECIAL';
    categoryColor = 'bg-purple-500/20 text-purple-300 border-purple-400/40';
    cardBorder = 'border-purple-400 ring-2 ring-purple-500/40';
    cardBg = 'bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950';
  } else if (isTrapCard) {
    categoryBadge = '⚠️ CARTA TRAMPA';
    categoryColor = 'bg-rose-500/20 text-rose-300 border-rose-400/40';
    cardBorder = 'border-rose-500 ring-2 ring-rose-500/40';
    cardBg = 'bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900';
  } else if (isRewardCard) {
    categoryBadge = '⭐ RECOMPENSA';
    categoryColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
    cardBorder = 'border-emerald-400 ring-2 ring-emerald-500/40';
    cardBg = 'bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900';
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* 3D Playing Card Container */}
      <div className="relative w-full max-w-[280px] h-[340px] perspective-1000 group">
        <div
          className={`relative w-full h-full duration-700 transition-transform transform-style-3d shadow-2xl rounded-2xl cursor-pointer ${
            isRevealed ? 'rotate-y-180' : ''
          } ${isFlipping ? 'scale-105' : ''}`}
          onClick={!isRevealed ? handleReveal : undefined}
        >
          {/* BACK FACE (CARTA BOCA ABAJO) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-slate-950 to-amber-950 p-3 border-4 border-amber-400 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Playing Card Back Pattern Overlay */}
            <div className="absolute inset-2 border-2 border-amber-400/40 rounded-xl bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:12px_12px] opacity-25 pointer-events-none" />

            {/* Top Back Header */}
            <div className="flex justify-between items-center text-amber-300 font-bold text-xs px-2 pt-1">
              <span>🃏 CASINO</span>
              <span>ESTADÍSTICO</span>
            </div>

            {/* Center Emblem */}
            <div className="flex flex-col items-center justify-center space-y-2 z-10 text-center my-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-lg shadow-amber-500/40 animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center border-2 border-amber-400">
                  <span className="text-4xl">🃏</span>
                </div>
              </div>

              <h4 className="text-sm font-black text-amber-300 uppercase tracking-widest drop-shadow">
                CARTA SORPRESA
              </h4>
              <p className="text-[10px] text-amber-200/80 px-4">
                Toca para girar la carta y descubrir tu desafío de esta ronda
              </p>
            </div>

            {/* Bottom Reveal Action Button */}
            <div className="z-10 pb-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReveal();
                }}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>✨ REVELAR CARTA</span>
              </button>
            </div>
          </div>

          {/* FRONT FACE (CARTA REVELADA) */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-4 border-4 shadow-2xl flex flex-col justify-between overflow-hidden ${cardBorder} ${cardBg}`}
          >
            {/* Top Corners Card Badge */}
            <div className="flex items-center justify-between border-b pb-2 border-slate-800">
              <div className="flex items-center space-x-1">
                <span className="text-lg">{card.icon}</span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryColor}`}
                >
                  {categoryBadge}
                </span>
              </div>
              <span className="text-xs font-black text-amber-400 font-mono">
                {card.category.toUpperCase()}
              </span>
            </div>

            {/* Card Content Body */}
            <div className="space-y-2 my-auto text-center px-1">
              <div className="text-4xl animate-bounce my-1">{card.icon}</div>

              <h3
                className={`text-sm font-black uppercase tracking-tight ${
                  isJokerCard ? 'text-purple-200' : isTrapCard ? 'text-rose-200' : isRewardCard ? 'text-emerald-200' : 'text-amber-300'
                }`}
              >
                {card.title}
              </h3>

              <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                {card.description}
              </p>

              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-black text-[11px] shadow-sm">
                🎁 {card.bonusText}
              </div>
            </div>

            {/* Card Action Controls */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {isJokerCard ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isJokerUsed) onUseJoker();
                  }}
                  disabled={isJokerUsed || isSimulating}
                  className={`w-full py-2 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                    isJokerUsed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:brightness-110 active:scale-95'
                  }`}
                >
                  {isJokerUsed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>✓ COMODÍN UTILIZADO</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>🔄 CAMBIAR PREDICCIÓN</span>
                    </>
                  )}
                </button>
              ) : isTrapCard ? (
                <div className="text-[10px] text-center text-rose-300 font-bold bg-rose-950/50 p-1.5 rounded-lg border border-rose-500/30">
                  ⚠️ Trampa Activa: ¡Juega con atención extra!
                </div>
              ) : isRewardCard ? (
                <div className="text-[10px] text-center text-emerald-300 font-bold bg-emerald-950/50 p-1.5 rounded-lg border border-emerald-500/30">
                  ⭐ Recompensa lista para aplicarse
                </div>
              ) : (
                <div className="text-[10px] text-center text-amber-300 font-bold bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                  🎯 Desafío Activo para tus próximos lanzamientos
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDrawNewCard();
                }}
                disabled={isSimulating}
                className="w-full py-1 text-[10px] font-bold text-slate-400 hover:text-amber-300 transition-colors"
              >
                🎴 Sacar Otra Carta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
