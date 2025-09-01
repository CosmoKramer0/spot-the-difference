import { create } from 'zustand';

export interface IconSet {
  id: string;
  name: string;
  description: string;
  icons: string[];
  correctIcon: number;
  difficulty: number;
}

interface GameState {
  currentRound: number;
  totalRounds: number;
  startTime: Date | null;
  sessionId: string | null;
  isGameActive: boolean;
  isGameComplete: boolean;
  iconSets: IconSet[];
  currentIconSet: IconSet | null;
  score: number;
  correctAnswers: number;
  
  setGameSession: (sessionId: string, startTime: Date) => void;
  setIconSets: (iconSets: IconSet[]) => void;
  setGameActive: (active: boolean) => void;
  nextRound: () => void;
  resetGame: () => void;
  endGame: () => void;
  selectIcon: (iconIndex: number) => boolean; // returns true if correct
}

export const useGameStore = create<GameState>((set, get) => ({
  currentRound: 1,
  totalRounds: 6,
  startTime: null,
  sessionId: null,
  isGameActive: false,
  isGameComplete: false,
  iconSets: [],
  currentIconSet: null,
  score: 0,
  correctAnswers: 0,

  setGameSession: (sessionId: string, startTime: Date) =>
    set({ 
      sessionId, 
      startTime, 
      isGameActive: true, 
      isGameComplete: false,
      currentRound: 1,
      score: 0,
      correctAnswers: 0 
    }),

  setIconSets: (iconSets: IconSet[]) =>
    set({ 
      iconSets, 
      currentIconSet: iconSets[0] || null 
    }),

  setGameActive: (active: boolean) =>
    set({ isGameActive: active }),

  nextRound: () =>
    set((state) => {
      const nextRound = state.currentRound + 1;
      const isComplete = nextRound > state.totalRounds;
      
      return {
        currentRound: nextRound,
        currentIconSet: isComplete ? null : state.iconSets[nextRound - 1] || null,
        isGameComplete: isComplete,
        isGameActive: !isComplete
      };
    }),

  resetGame: () =>
    set({
      currentRound: 1,
      startTime: null,
      sessionId: null,
      isGameActive: false,
      isGameComplete: false,
      iconSets: [],
      currentIconSet: null,
      score: 0,
      correctAnswers: 0,
    }),

  endGame: () =>
    set({ 
      isGameActive: false, 
      isGameComplete: true 
    }),

  selectIcon: (iconIndex: number) => {
    const state = get();
    if (!state.currentIconSet) return false;
    
    const isCorrect = iconIndex === state.currentIconSet.correctIcon;
    
    if (isCorrect) {
      set((state) => ({
        correctAnswers: state.correctAnswers + 1,
        score: state.score + (100 * state.currentIconSet!.difficulty)
      }));
    }
    
    return isCorrect;
  },
}));