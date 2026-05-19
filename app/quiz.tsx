import React, { useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getLabelById, distractorPool, getTodayLabel } from "../data/labels";
import { useApp, todayStr } from "../context/AppContext";
import QuizOption from "../components/QuizOption";
import LabelCard from "../components/LabelCard";
import { colors, radii, spacing } from "../constants/theme";
import { Word } from "../types";

type Choice = { ja: string; correct: boolean };

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(word: Word, allDistractors: string[], seed: number): Choice[] {
  const wrongs = allDistractors.filter((d) => d !== word.ja);
  const picked = shuffle(wrongs, seed).slice(0, 3);
  const choices: Choice[] = [
    { ja: word.ja, correct: true },
    ...picked.map((ja) => ({ ja, correct: false })),
  ];
  return shuffle(choices, seed + 1);
}

export default function QuizScreen() {
  const params = useLocalSearchParams<{ labelId?: string }>();
  const router = useRouter();
  const { saveQuizResult } = useApp();
  const label = useMemo(() => {
    if (params.labelId) {
      const l = getLabelById(params.labelId);
      if (l) return l;
    }
    return getTodayLabel(todayStr(), false);
  }, [params.labelId]);

  const seed = useMemo(
    () => Array.from(label.id + todayStr()).reduce((s, c) => s + c.charCodeAt(0), 0),
    [label.id],
  );

  const questions = useMemo(() => {
    return label.words.map((w, i) => ({
      word: w,
      choices: buildChoices(w, distractorPool, seed + i * 13),
    }));
  }, [label, seed]);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongWords, setWrongWords] = useState<string[]>([]);

  const current = questions[step];
  const progress = ((step + (selected !== null ? 1 : 0)) / questions.length) * 100;

  const onSelect = useCallback(
    (i: number) => {
      if (selected !== null) return;
      setSelected(i);
      const choice = current.choices[i];
      if (choice.correct) setScore((s) => s + 1);
      else setWrongWords((w) => [...w, current.word.en]);
    },
    [selected, current],
  );

  const onNext = useCallback(async () => {
    if (selected === null) return;
    if (step + 1 < questions.length) {
      setStep((s) => s + 1);
      setSelected(null);
      return;
    }
    // finished
    const result = {
      labelId: label.id,
      date: todayStr(),
      score,
      wrongWords,
    };
    await saveQuizResult(result);
    router.replace({
      pathname: "/result",
      params: { labelId: label.id, score: String(score), wrongWords: wrongWords.join(",") },
    });
  }, [selected, step, questions.length, label.id, score, wrongWords, saveQuizResult, router]);

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="quiz-screen">
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.stepLabel}>
        {step + 1} / {questions.length}
      </Text>

      <View style={styles.labelArea}>
        <LabelCard label={label} size="md" />
      </View>

      <View style={styles.question}>
        <Text style={styles.questionEn}>{current.word.en}</Text>
        {current.word.hint && <Text style={styles.questionHint}>💡 {current.word.hint}</Text>}
        <Text style={styles.questionJa}>↑この単語の意味は？</Text>
      </View>

      <View style={styles.options}>
        {current.choices.map((c, i) => {
          let state: "default" | "correct" | "wrong" | "disabled" = "default";
          if (selected !== null) {
            if (c.correct) state = "correct";
            else if (i === selected) state = "wrong";
            else state = "disabled";
          }
          return (
            <QuizOption
              key={`${step}-${i}`}
              label={c.ja}
              index={i}
              state={state}
              onPress={() => onSelect(i)}
            />
          );
        })}
      </View>

      {selected !== null && (
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={onNext}
          accessibilityLabel="next-question-button"
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {step + 1 < questions.length ? "次へ ▶" : "結果を見る"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.bg,
    flexGrow: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  progressFill: { height: "100%", backgroundColor: colors.accent },
  stepLabel: {
    fontSize: 12,
    color: colors.textSub,
    textAlign: "right",
    marginBottom: spacing.md,
  },
  labelArea: { alignItems: "center", marginBottom: spacing.lg },
  question: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  questionEn: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
  },
  questionHint: { marginTop: 6, fontSize: 13, color: colors.textSub },
  questionJa: { marginTop: 6, fontSize: 12, color: colors.textSub },
  options: { marginBottom: spacing.md },
  nextBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: radii.pill,
    alignItems: "center",
    marginTop: spacing.md,
  },
  nextBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
