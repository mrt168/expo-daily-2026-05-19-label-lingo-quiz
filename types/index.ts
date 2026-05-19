export type LabelCategory =
  | "starter"
  | "shampoo"
  | "menu"
  | "snack"
  | "electronics"
  | "cosmetics"
  | "stationery"
  | "kitchen"
  | "clothing"
  | "drink";

export interface Word {
  en: string;
  ja: string;
  hint?: string;
}

export interface Label {
  id: string;
  category: LabelCategory;
  title: string;
  emoji: string;
  color: string;
  words: Word[];
}

export interface QuizResult {
  labelId: string;
  date: string;
  score: number;
  wrongWords: string[];
}

export interface AppState {
  streak: number;
  lastPlayedAt: string | null;
  clearedLabels: string[];
  wrongQueue: string[];
  results: QuizResult[];
  totalPlays: number;
  hasOpenedBefore: boolean;
}

export const initialState: AppState = {
  streak: 0,
  lastPlayedAt: null,
  clearedLabels: [],
  wrongQueue: [],
  results: [],
  totalPlays: 0,
  hasOpenedBefore: false,
};
