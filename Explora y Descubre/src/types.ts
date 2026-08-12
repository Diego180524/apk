export type GameScene = 
  | 'MISSION_1_MALECON'
  | 'MISSION_2_RUTA'
  | 'MISSION_3_PARQUE'
  | 'TRANSITION_GATHERING'
  | 'EXPLANATION_DESCRIPTIVE'
  | 'VISUALIZATIONS_CHARTS'
  | 'FINAL_CHALLENGE'
  | 'VICTORY_SCREEN';

export interface ActivityChoice {
  id: string;
  name: string;
  durationMin: number;
  iconName: string;
  category: string;
  description: string;
  xPercent: number; // For placing hotspot on image
  yPercent: number;
}

export interface CollectedData {
  maleconActivities: { name: string; minutes: number }[];
  rutaTimes: number[];
  iguanaValues: number[];
  scatterData: { x: number; y: number; label: string }[];
}

export type StatConceptKey = 'media' | 'mediana' | 'moda' | 'rango' | 'dispersion' | 'atipico';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
