import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, initialState, QuizResult } from "../types";

const STORAGE_KEY = "labelLingoState_v1";

type Ctx = {
  state: AppState;
  ready: boolean;
  saveQuizResult: (result: QuizResult) => Promise<void>;
  removeWrongWord: (en: string) => Promise<void>;
  markOpened: () => Promise<void>;
  resetAll: () => Promise<void>;
};

const AppContext = createContext<Ctx | null>(null);

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      } catch (e) {
        console.warn("AppContext load failed", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: AppState) => {
    setState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("AppContext save failed", e);
    }
  }, []);

  const saveQuizResult = useCallback(
    async (result: QuizResult) => {
      const date = result.date;
      // streak computation
      let streak = state.streak;
      const last = state.lastPlayedAt;
      if (last !== date) {
        if (last) {
          const lastD = new Date(last);
          const todayD = new Date(date);
          const diff = Math.round((todayD.getTime() - lastD.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) streak = state.streak + 1;
          else if (diff > 1) streak = 1;
          else streak = state.streak; // 同じ日 or 過去
        } else {
          streak = 1;
        }
      }
      const cleared = result.score >= 3 && !state.clearedLabels.includes(result.labelId)
        ? [...state.clearedLabels, result.labelId]
        : state.clearedLabels;
      const wrongQueue = Array.from(new Set([...state.wrongQueue, ...result.wrongWords]));
      const next: AppState = {
        ...state,
        streak,
        lastPlayedAt: date,
        clearedLabels: cleared,
        wrongQueue,
        results: [result, ...state.results].slice(0, 100),
        totalPlays: state.totalPlays + 1,
        hasOpenedBefore: true,
      };
      await persist(next);
    },
    [state, persist],
  );

  const removeWrongWord = useCallback(
    async (en: string) => {
      const next: AppState = {
        ...state,
        wrongQueue: state.wrongQueue.filter((w) => w !== en),
      };
      await persist(next);
    },
    [state, persist],
  );

  const markOpened = useCallback(async () => {
    if (state.hasOpenedBefore) return;
    await persist({ ...state, hasOpenedBefore: true });
  }, [state, persist]);

  const resetAll = useCallback(async () => {
    await persist({ ...initialState, hasOpenedBefore: true });
  }, [persist]);

  return (
    <AppContext.Provider value={{ state, ready, saveQuizResult, removeWrongWord, markOpened, resetAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): Ctx {
  const c = useContext(AppContext);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}

export { todayStr };
