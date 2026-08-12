import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameScene, CollectedData } from './types';
import { HeaderHUD } from './components/HeaderHUD';
import { Scene1Malecon } from './components/scenes/Scene1Malecon';
import { Scene2Ruta } from './components/scenes/Scene2Ruta';
import { Scene3ParqueSeminario } from './components/scenes/Scene3ParqueSeminario';
import { SceneTransition } from './components/scenes/SceneTransition';
import { SceneDescriptiveStats } from './components/scenes/SceneDescriptiveStats';
import { SceneCharts } from './components/scenes/SceneCharts';
import { SceneFinalChallenge } from './components/scenes/SceneFinalChallenge';
import { SceneVictory } from './components/scenes/SceneVictory';

export default function App() {
  const [currentScene, setCurrentScene] = useState<GameScene>('MISSION_1_MALECON');

  const [collectedData, setCollectedData] = useState<CollectedData>({
    maleconActivities: [],
    rutaTimes: [],
    iguanaValues: [],
    scatterData: [],
  });

  const totalDataCount =
    collectedData.maleconActivities.length +
    collectedData.rutaTimes.length +
    collectedData.iguanaValues.length;

  const handleCompleteMalecon = (activities: { name: string; minutes: number }[]) => {
    setCollectedData((prev) => ({
      ...prev,
      maleconActivities: activities,
    }));
    setCurrentScene('MISSION_2_RUTA');
  };

  const handleCompleteRuta = (times: number[]) => {
    setCollectedData((prev) => ({
      ...prev,
      rutaTimes: times,
    }));
    setCurrentScene('MISSION_3_PARQUE');
  };

  const handleCompleteParque = (iguanaVals: number[]) => {
    setCollectedData((prev) => ({
      ...prev,
      iguanaValues: iguanaVals,
    }));
    setCurrentScene('TRANSITION_GATHERING');
  };

  const handleRestart = () => {
    setCollectedData({
      maleconActivities: [],
      rutaTimes: [],
      iguanaValues: [],
      scatterData: [],
    });
    setCurrentScene('MISSION_1_MALECON');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans text-slate-100 flex flex-col antialiased select-none">
      <HeaderHUD
        currentScene={currentScene}
        totalDataCount={totalDataCount}
        onRestart={handleRestart}
      />

      <main className="flex-1 w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScene === 'MISSION_1_MALECON' && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Scene1Malecon onComplete={handleCompleteMalecon} />
            </motion.div>
          )}

          {currentScene === 'MISSION_2_RUTA' && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Scene2Ruta onComplete={handleCompleteRuta} />
            </motion.div>
          )}

          {currentScene === 'MISSION_3_PARQUE' && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Scene3ParqueSeminario onComplete={handleCompleteParque} />
            </motion.div>
          )}

          {currentScene === 'TRANSITION_GATHERING' && (
            <motion.div
              key="scene-transition"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <SceneTransition
                collectedData={collectedData}
                onProceed={() => setCurrentScene('EXPLANATION_DESCRIPTIVE')}
              />
            </motion.div>
          )}

          {currentScene === 'EXPLANATION_DESCRIPTIVE' && (
            <motion.div
              key="scene-explanation"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <SceneDescriptiveStats
                collectedData={collectedData}
                onProceedToCharts={() => setCurrentScene('VISUALIZATIONS_CHARTS')}
              />
            </motion.div>
          )}

          {currentScene === 'VISUALIZATIONS_CHARTS' && (
            <motion.div
              key="scene-charts"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <SceneCharts
                collectedData={collectedData}
                onProceedToChallenge={() => setCurrentScene('FINAL_CHALLENGE')}
              />
            </motion.div>
          )}

          {currentScene === 'FINAL_CHALLENGE' && (
            <motion.div
              key="scene-challenge"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <SceneFinalChallenge onComplete={() => setCurrentScene('VICTORY_SCREEN')} />
            </motion.div>
          )}

          {currentScene === 'VICTORY_SCREEN' && (
            <motion.div
              key="scene-victory"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <SceneVictory onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
