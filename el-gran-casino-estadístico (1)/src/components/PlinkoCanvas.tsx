import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Ball, Peg } from '../types/plinko';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PlinkoCanvasProps {
  data: number[];
  onBallLanded: (binIndex: number) => void;
  onBatchFinished: () => void;
  isSimulating: boolean;
  totalToLaunch: number;
  launchedCount: number;
  completedCount: number;
  simulationSpeed: 'normal' | 'fast' | 'turbo' | 'instant';
  probabilityP: number;
  soundEnabled: boolean;
}

const N_LEVELS = 10; // 10 levels of pegs -> 11 bins (0 to 10)
const TOTAL_BINS = 11;

interface VisualParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export const PlinkoCanvas: React.FC<PlinkoCanvasProps> = ({
  onBallLanded,
  onBatchFinished,
  isSimulating,
  totalToLaunch,
  launchedCount,
  completedCount,
  simulationSpeed,
  probabilityP,
  soundEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active balls animating on canvas
  const activeBallsRef = useRef<Ball[]>([]);
  // Hit pegs animation timers
  const hitPegsRef = useRef<Set<string>>(new Set());
  // Bins counts stored internally for physical bin visualizer
  const binCountsRef = useRef<number[]>(new Array(TOTAL_BINS).fill(0));
  // Visual spark particles
  const particlesRef = useRef<VisualParticle[]>([]);

  // Local UI dimensions
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });

  // Update sound manager
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Handle ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth || 600;
      // Maintain roughly 4:3.5 aspect ratio
      const height = Math.min(Math.max(width * 0.85, 380), 520);
      setDimensions({ width, height });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, []);

  // Generate Peg layout coordinates based on dimensions
  const getBoardGeometry = useCallback(() => {
    const { width, height } = dimensions;
    const topPadding = 48;
    const bottomPadding = 82;
    const boardHeight = height - topPadding - bottomPadding;

    const rowSpacing = boardHeight / (N_LEVELS + 1);
    const colSpacing = (width * 0.82) / TOTAL_BINS;

    const pegs: Peg[] = [];

    // Peg pyramid: Level 0 has 1 peg, Level 1 has 2 pegs, ..., Level 9 has 10 pegs
    for (let level = 0; level < N_LEVELS; level++) {
      const numPegsInRow = level + 1;
      const rowY = topPadding + (level + 1) * rowSpacing;

      // Center the row horizontally
      const startX = width / 2 - ((numPegsInRow - 1) * colSpacing) / 2;

      for (let i = 0; i < numPegsInRow; i++) {
        pegs.push({
          x: startX + i * colSpacing,
          y: rowY,
          radius: Math.max(3.8, width / 135),
          level,
          index: i,
        });
      }
    }

    // Bins boundaries
    const binY = height - bottomPadding;
    const binWidth = colSpacing;
    // binStartX is the center of Bin 0 (aligned with bouncing left off Peg 0 at Level 9)
    const binStartX = width / 2 - 5 * colSpacing;

    return {
      topPadding,
      rowSpacing,
      colSpacing,
      pegs,
      binY,
      binWidth,
      binStartX,
      boardHeight,
    };
  }, [dimensions]);

  // Spawn spark particle burst on peg collision
  const createSparkles = (x: number, y: number, color: string = '#FBBF24') => {
    if (particlesRef.current.length > 25) return; // Cap particle count for optimal FPS
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        color,
        size: Math.random() * 2.5 + 1.2,
        alpha: 1.0,
      });
    }
  };

  // Spawn a single ball
  const spawnBall = useCallback(
    (ballId: number) => {
      const { width } = dimensions;
      // Calculate path ahead of time for deterministic bin outcome with physics interpolation
      const path: number[] = [];
      let totalRight = 0;
      for (let l = 0; l < N_LEVELS; l++) {
        const moveRight = Math.random() < probabilityP ? 1 : 0;
        path.push(moveRight);
        if (moveRight) totalRight++;
      }

      const targetBin = totalRight;

      // Casino Ball Colors: Golden, Emerald, Electric Blue, Violet
      const ballColors = ['#F59E0B', '#10B981', '#38BDF8', '#A855F7', '#EC4899'];
      const color = ballColors[ballId % ballColors.length];

      const newBall: Ball = {
        id: ballId,
        x: width / 2 + (Math.random() * 4 - 2),
        y: 25,
        vx: (Math.random() - 0.5) * 0.6,
        vy: simulationSpeed === 'turbo' ? 6 : simulationSpeed === 'fast' ? 4 : 2.5,
        radius: Math.max(5.5, width / 105),
        color,
        targetBin,
        currentLevel: 0,
        path,
        isSettled: false,
        trail: [],
      };

      activeBallsRef.current.push(newBall);
    },
    [dimensions, probabilityP, simulationSpeed]
  );

  // Main Physics & Render Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { pegs, binY, colSpacing, binStartX, binWidth } = getBoardGeometry();

    const speedMultiplier =
      simulationSpeed === 'turbo' ? 2.5 : simulationSpeed === 'fast' ? 1.6 : 1.0;

    let timeStep = 0;

    const render = () => {
      timeStep += 0.05;

      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Deep Casino Black & Indigo Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, dimensions.height);
      bgGrad.addColorStop(0, '#020617'); // Slate 950
      bgGrad.addColorStop(0.5, '#0F172A'); // Dark Navy
      bgGrad.addColorStop(1, '#1E1B4B'); // Casino Indigo
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw Casino Glowing Border Lights
      const borderPadding = 6;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#D97706'; // Gold border
      ctx.strokeRect(borderPadding, borderPadding, dimensions.width - borderPadding * 2, dimensions.height - borderPadding * 2);

      // Top Drop Launcher Funnel
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.beginPath();
      ctx.arc(dimensions.width / 2, 22, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(dimensions.width / 2, 22, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(dimensions.width / 2, 22, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw Pegs (Casino Metallic & Neon Lit)
      pegs.forEach((peg) => {
        const pegKey = `${peg.level}-${peg.index}`;
        const isHit = hitPegsRef.current.has(pegKey);

        if (isHit) {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
          ctx.beginPath();
          ctx.arc(peg.x, peg.y, peg.radius * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FBBF24';
        } else {
          ctx.fillStyle = '#94A3B8';
        }

        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        ctx.fill();

        // Metallic reflection dot
        ctx.fillStyle = isHit ? '#FFFFFF' : '#F1F5F9';
        ctx.beginPath();
        ctx.arc(peg.x - 1, peg.y - 1, peg.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Particles
      const remainingParticles: VisualParticle[] = [];
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.04;
        if (p.alpha > 0) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          remainingParticles.push(p);
        }
      });
      particlesRef.current = remainingParticles;

      // Draw Bins at bottom
      const totalCountAll = binCountsRef.current.reduce((a, b) => a + b, 0);

      for (let b = 0; b < TOTAL_BINS; b++) {
        const bX = binStartX + b * colSpacing;
        const count = binCountsRef.current[b] || 0;

        // Divider lines
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bX - binWidth / 2, binY);
        ctx.lineTo(bX - binWidth / 2, dimensions.height - 24);
        ctx.stroke();

        // Fill bar inside bin
        const maxBarHeight = 48;
        const fillH = Math.min(
          maxBarHeight,
          (count / Math.max(1, Math.max(...binCountsRef.current))) * maxBarHeight
        );

        // Center bin highlight vs edges
        const isCenterBin = b === 5;
        const fillGradient = ctx.createLinearGradient(0, dimensions.height - 24, 0, dimensions.height - 24 - fillH);
        if (isCenterBin) {
          fillGradient.addColorStop(0, 'rgba(245, 158, 11, 0.7)'); // Gold
          fillGradient.addColorStop(1, 'rgba(251, 191, 36, 0.2)');
        } else {
          fillGradient.addColorStop(0, 'rgba(56, 189, 248, 0.6)'); // Electric blue
          fillGradient.addColorStop(1, 'rgba(168, 85, 247, 0.2)');
        }

        ctx.fillStyle = fillGradient;
        ctx.fillRect(bX - binWidth / 2 + 1, dimensions.height - 24 - fillH, binWidth - 2, fillH);

        // Bin number label
        ctx.fillStyle = isCenterBin ? '#FBBF24' : '#E2E8F0';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${b}`, bX, dimensions.height - 8);

        // Bin count overlay
        if (count > 0) {
          ctx.fillStyle = isCenterBin ? '#FDE047' : '#38BDF8';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText(`${count}`, bX, dimensions.height - 28 - fillH);
        }
      }

      // Draw rightmost divider boundary
      const lastBX = binStartX + TOTAL_BINS * colSpacing;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.beginPath();
      ctx.moveTo(lastBX - binWidth / 2, binY);
      ctx.lineTo(lastBX - binWidth / 2, dimensions.height - 24);
      ctx.stroke();

      // Update and Draw Active Balls
      const remainingBalls: Ball[] = [];

      activeBallsRef.current.forEach((ball) => {
        // Trail effect
        ball.trail.unshift({ x: ball.x, y: ball.y, alpha: 0.7 });
        if (ball.trail.length > 7) ball.trail.pop();

        ball.trail.forEach((t, idx) => {
          ctx.fillStyle = ball.color;
          ctx.globalAlpha = t.alpha * (1 - idx / 7) * 0.5;
          ctx.beginPath();
          ctx.arc(t.x, t.y, ball.radius * (1 - idx / 10), 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        });

        // Gravity & speed update
        ball.vy += 0.22 * speedMultiplier;
        ball.y += ball.vy;
        ball.x += ball.vx;

        // Check peg collisions
        pegs.forEach((peg) => {
          if (peg.level >= ball.currentLevel) {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = ball.radius + peg.radius;

            if (dist < minDist) {
              ball.currentLevel = peg.level + 1;

              const pegKey = `${peg.level}-${peg.index}`;
              hitPegsRef.current.add(pegKey);
              setTimeout(() => {
                hitPegsRef.current.delete(pegKey);
              }, 120);

              soundManager.playPegHit(peg.level);
              createSparkles(peg.x, peg.y, ball.color);

              const decision =
                ball.path[peg.level] !== undefined
                  ? ball.path[peg.level]
                  : Math.random() < probabilityP
                  ? 1
                  : 0;
              const pushX = decision === 1 ? 1.8 : -1.8;

              ball.vx = pushX * (0.8 + Math.random() * 0.4) * speedMultiplier;
              ball.vy = -1.5 * speedMultiplier;
              ball.y = peg.y - minDist;
            }
          }
        });

        // Check bin landing at bottom
        if (ball.y >= binY) {
          // Calculate exact physical landed bin based on physical x coordinate at binY
          const binFloat = (ball.x - binStartX) / colSpacing;
          const landedBin = Math.min(10, Math.max(0, Math.round(binFloat)));

          soundManager.playBinLanding(landedBin);
          onBallLanded(landedBin);

          createSparkles(ball.x, binY, '#F59E0B');

          binCountsRef.current[landedBin] = (binCountsRef.current[landedBin] || 0) + 1;
        } else {
          remainingBalls.push(ball);

          // Render Shiny Casino Ball with fast vector glow
          ctx.fillStyle = ball.color;
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;

          ctx.fillStyle = ball.color;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fill();

          // Ball Metallic Inner Shine
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(ball.x - 2, ball.y - 2, ball.radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      activeBallsRef.current = remainingBalls;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, getBoardGeometry, probabilityP, simulationSpeed, onBallLanded]);

  // Sync binCountsRef when data is reset
  useEffect(() => {
    if (completedCount === 0) {
      binCountsRef.current = new Array(TOTAL_BINS).fill(0);
      activeBallsRef.current = [];
    }
  }, [completedCount]);

  // Handle batch dropping trigger
  useEffect(() => {
    if (!isSimulating) return;

    if (simulationSpeed === 'instant') {
      const toDrop = totalToLaunch - launchedCount;
      if (toDrop > 0) {
        for (let i = 0; i < toDrop; i++) {
          let rightCount = 0;
          for (let l = 0; l < N_LEVELS; l++) {
            if (Math.random() < probabilityP) rightCount++;
          }
          binCountsRef.current[rightCount] = (binCountsRef.current[rightCount] || 0) + 1;
          onBallLanded(rightCount);
        }
        onBatchFinished();
      }
      return;
    }

    const intervalMs =
      simulationSpeed === 'turbo' ? 30 : simulationSpeed === 'fast' ? 70 : 150;

    let currentDropId = launchedCount;

    const timer = setInterval(() => {
      if (currentDropId < totalToLaunch) {
        spawnBall(currentDropId + 1);
        currentDropId++;
      } else {
        clearInterval(timer);
        const checkFinishTimer = setInterval(() => {
          if (activeBallsRef.current.length === 0) {
            clearInterval(checkFinishTimer);
            soundManager.playBatchFinish();
            onBatchFinished();

            // Casino celebration confetti burst
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.75 },
                colors: ['#F59E0B', '#10B981', '#38BDF8', '#A855F7'],
              });
            } catch {
              // Ignore
            }
          }
        }, 100);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    isSimulating,
    totalToLaunch,
    launchedCount,
    simulationSpeed,
    probabilityP,
    spawnBall,
    onBallLanded,
    onBatchFinished,
  ]);

  // Progress percentage
  const progressPercent =
    totalToLaunch > 0 ? Math.min(100, Math.round((completedCount / totalToLaunch) * 100)) : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-slate-950 border-2 border-amber-500/40 shadow-2xl shadow-amber-950/20 space-y-0"
    >
      {/* Animated Simulation Progress Bar Overlay when simulating */}
      {isSimulating && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-slate-950/90 backdrop-blur-md px-4 py-2 border-b border-amber-500/30 flex items-center justify-between text-xs font-bold text-amber-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Simulando experiencia aleatoria de casino...</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{completedCount} / {totalToLaunch} pelotas</span>
            <span className="text-emerald-400 font-extrabold">{progressPercent}%</span>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block w-full touch-none"
      />
    </div>
  );
};

