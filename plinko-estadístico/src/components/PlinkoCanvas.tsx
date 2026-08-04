import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Ball, Peg } from '../types/plinko';
import { soundManager } from '../utils/audio';

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

  // Local UI stats overlay
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
    const topPadding = 45;
    const bottomPadding = 80;
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
          radius: Math.max(3.5, width / 140),
          level,
          index: i,
        });
      }
    }

    // Bins boundaries
    const binY = height - bottomPadding;
    const binWidth = (width * 0.82) / TOTAL_BINS;
    const binStartX = width / 2 - ((TOTAL_BINS - 1) * colSpacing) / 2 - binWidth / 2;

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

  // Spawn a single ball
  const spawnBall = useCallback(
    (ballId: number) => {
      const { width } = dimensions;
      // Calculate path ahead of time for deterministic bin outcome with physics interpolation
      const path: number[] = [];
      let totalRight = 0;
      for (let l = 0; l < N_LEVELS; l++) {
        // Bias according to probabilityP
        const moveRight = Math.random() < probabilityP ? 1 : 0;
        path.push(moveRight);
        if (moveRight) totalRight++;
      }

      // Total right turns out of 10 levels determines final bin (0 to 10)
      const targetBin = totalRight;

      const newBall: Ball = {
        id: ballId,
        x: width / 2 + (Math.random() * 4 - 2),
        y: 25,
        vx: (Math.random() - 0.5) * 0.5,
        vy: simulationSpeed === 'turbo' ? 6 : simulationSpeed === 'fast' ? 4 : 2.5,
        radius: Math.max(5, width / 110),
        color: '#8B5CF6', // Purple ball
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

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, dimensions.height);
      bgGrad.addColorStop(0, '#0F172A'); // Slate 900
      bgGrad.addColorStop(1, '#1E1B4B'); // Indigo 950
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw decorative grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < dimensions.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }

      // Draw Top Launcher Drop Point
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(dimensions.width / 2, 20, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#60A5FA';
      ctx.beginPath();
      ctx.arc(dimensions.width / 2, 20, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw Pegs
      pegs.forEach((peg) => {
        const pegKey = `${peg.level}-${peg.index}`;
        const isHit = hitPegsRef.current.has(pegKey);

        if (isHit) {
          // Glow effect on hit
          ctx.shadowColor = '#C084FC';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#F472B6'; // Bright pink/magenta hit
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#94A3B8'; // Slate 400
        }

        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = isHit ? '#FFFFFF' : '#CBD5E1';
        ctx.beginPath();
        ctx.arc(peg.x - 1, peg.y - 1, peg.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;

      // Draw Bins at bottom
      const totalCountAll = binCountsRef.current.reduce((a, b) => a + b, 0);

      for (let b = 0; b < TOTAL_BINS; b++) {
        const bX = binStartX + b * colSpacing;
        const count = binCountsRef.current[b] || 0;
        const pct = totalCountAll > 0 ? (count / totalCountAll) * 100 : 0;

        // Bin vertical divider lines
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bX - binWidth / 2, binY);
        ctx.lineTo(bX - binWidth / 2, dimensions.height - 22);
        ctx.stroke();

        // Fill indicator bar inside bin
        const maxBarHeight = 45;
        const fillH = Math.min(maxBarHeight, (count / Math.max(1, Math.max(...binCountsRef.current))) * maxBarHeight);

        // Highlight central bins vs edges with distinct blue-purple colors
        const colorHue = 210 + b * 10; // Slate blue to purple
        ctx.fillStyle = `hsla(${colorHue}, 80%, 60%, 0.35)`;
        ctx.fillRect(bX - binWidth / 2 + 1, dimensions.height - 22 - fillH, binWidth - 2, fillH);

        // Bin number label
        ctx.fillStyle = b === 5 ? '#38BDF8' : '#E2E8F0';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${b}`, bX, dimensions.height - 8);

        // Bin count overlay
        if (count > 0) {
          ctx.fillStyle = '#93C5FD';
          ctx.font = '10px sans-serif';
          ctx.fillText(`${count}`, bX, dimensions.height - 26 - fillH);
        }
      }

      // Draw rightmost divider boundary
      const lastBX = binStartX + TOTAL_BINS * colSpacing;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.beginPath();
      ctx.moveTo(lastBX - binWidth / 2, binY);
      ctx.lineTo(lastBX - binWidth / 2, dimensions.height - 22);
      ctx.stroke();

      // Update and Draw Active Balls
      const remainingBalls: Ball[] = [];

      activeBallsRef.current.forEach((ball) => {
        // Trail effect
        ball.trail.unshift({ x: ball.x, y: ball.y, alpha: 0.6 });
        if (ball.trail.length > 6) ball.trail.pop();

        ball.trail.forEach((t, idx) => {
          ctx.fillStyle = `rgba(168, 85, 247, ${t.alpha * (1 - idx / 6)})`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, ball.radius * (1 - idx / 10), 0, Math.PI * 2);
          ctx.fill();
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
              // Hit peg!
              ball.currentLevel = peg.level + 1;

              const pegKey = `${peg.level}-${peg.index}`;
              hitPegsRef.current.add(pegKey);
              setTimeout(() => {
                hitPegsRef.current.delete(pegKey);
              }, 120);

              soundManager.playPegHit(peg.level);

              // Bounce direction according to pre-determined path at this level
              const decision = ball.path[peg.level] !== undefined ? ball.path[peg.level] : (Math.random() < probabilityP ? 1 : 0);
              const pushX = decision === 1 ? 1.8 : -1.8;

              ball.vx = pushX * (0.8 + Math.random() * 0.4) * speedMultiplier;
              ball.vy = -1.5 * speedMultiplier; // Elastic bounce upward slightly
              ball.y = peg.y - minDist;
            }
          }
        });

        // Check bin landing
        if (ball.y >= binY) {
          // Ball settled in bin
          const landedBin = ball.targetBin !== undefined ? ball.targetBin : Math.min(10, Math.max(0, Math.floor((ball.x - (binStartX - binWidth / 2)) / colSpacing)));

          soundManager.playBinLanding(landedBin);
          onBallLanded(landedBin);

          // Update bin counts
          binCountsRef.current[landedBin] = (binCountsRef.current[landedBin] || 0) + 1;
        } else {
          remainingBalls.push(ball);

          // Render ball
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 8;
          ctx.fillStyle = '#C084FC'; // Glow violet
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(ball.x - 1.5, ball.y - 1.5, ball.radius * 0.35, 0, Math.PI * 2);
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

  // Sync binCountsRef when data is reset or initialized from parent
  useEffect(() => {
    // Check if parent state dropped all data (reset)
    if (completedCount === 0) {
      binCountsRef.current = new Array(TOTAL_BINS).fill(0);
      activeBallsRef.current = [];
    }
  }, [completedCount]);

  // Handle batch dropping trigger
  useEffect(() => {
    if (!isSimulating) return;

    if (simulationSpeed === 'instant') {
      // Instant calculation mode for instant results
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

    // Interval drop for normal, fast, turbo speeds
    const intervalMs =
      simulationSpeed === 'turbo' ? 30 : simulationSpeed === 'fast' ? 70 : 150;

    let currentDropId = launchedCount;

    const timer = setInterval(() => {
      if (currentDropId < totalToLaunch) {
        spawnBall(currentDropId + 1);
        currentDropId++;
      } else {
        clearInterval(timer);
        // Check when active balls settle completely
        const checkFinishTimer = setInterval(() => {
          if (activeBallsRef.current.length === 0) {
            clearInterval(checkFinishTimer);
            soundManager.playBatchFinish();
            onBatchFinished();
          }
        }, 100);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulating, totalToLaunch, launchedCount, simulationSpeed, probabilityP, spawnBall, onBallLanded, onBatchFinished]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-indigo-900/60 shadow-xl">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block w-full touch-none"
      />
    </div>
  );
};
