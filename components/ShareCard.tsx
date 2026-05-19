import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Label, Word } from "../types";
import { colors, radii, spacing } from "../constants/theme";

type Props = {
  label: Label;
  words: Word[];
  results: boolean[]; // each word correct/wrong
  score: number;
  streak: number;
  date: string;
};

export default function ShareCard({ label, words, results, score, streak, date }: Props) {
  return (
    <View
      style={[styles.card, { backgroundColor: label.color + "26", borderColor: label.color }]}
      accessibilityLabel="share-card"
    >
      <View style={styles.header}>
        <Text style={styles.appName}>🏷️ ラベル英単語クイズ</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.hero}>
        <Text style={styles.emoji}>{label.emoji}</Text>
        <Text style={styles.title}>{label.title}</Text>
      </View>
      <View style={styles.wordList}>
        {words.map((w, i) => (
          <View key={w.en} style={styles.wordRow}>
            <Text style={[styles.tick, { color: results[i] ? colors.success : colors.error }]}>
              {results[i] ? "✓" : "✗"}
            </Text>
            <Text style={styles.en}>{w.en}</Text>
            <Text style={styles.ja}>{w.ja}</Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerItem}>🔥 連続 {streak}日</Text>
        <Text style={styles.footerItem}>スコア {score}/5</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    aspectRatio: 9 / 16,
    borderRadius: radii.xl,
    borderWidth: 2,
    padding: spacing.lg,
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: { fontSize: 13, fontWeight: "700", color: colors.text },
  date: { fontSize: 11, color: colors.textSub },
  hero: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  emoji: { fontSize: 72 },
  title: { fontSize: 18, fontWeight: "700", marginTop: 4, color: colors.text },
  wordList: {
    flex: 1,
    backgroundColor: colors.card + "CC",
    borderRadius: radii.md,
    padding: spacing.md,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tick: { width: 20, fontWeight: "700", fontSize: 14 },
  en: { width: 96, fontWeight: "600", color: colors.text },
  ja: { flex: 1, color: colors.textSub },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  footerItem: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
});
