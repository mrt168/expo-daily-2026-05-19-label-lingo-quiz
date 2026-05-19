import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { colors, radii, spacing } from "../constants/theme";

type Props = {
  label: string;
  index: number;
  state?: "default" | "correct" | "wrong" | "disabled";
  onPress?: () => void;
};

const LETTERS = ["A", "B", "C", "D"];

export default function QuizOption({ label, index, state = "default", onPress }: Props) {
  const isCorrect = state === "correct";
  const isWrong = state === "wrong";
  const bg = isCorrect ? colors.successBg : isWrong ? colors.errorBg : colors.card;
  const border = isCorrect ? colors.success : isWrong ? colors.error : colors.border;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={state === "default" ? onPress : undefined}
      style={[styles.btn, { backgroundColor: bg, borderColor: border }]}
      disabled={state !== "default"}
    >
      <View style={[styles.letter, { backgroundColor: border + "33" }]}>
        <Text style={[styles.letterText, { color: border }]}>{LETTERS[index]}</Text>
      </View>
      <Text style={styles.text}>{label}</Text>
      {isCorrect && <Text style={styles.icon}>✓</Text>}
      {isWrong && <Text style={[styles.icon, { color: colors.error }]}>✗</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radii.lg,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  letter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  letterText: { fontWeight: "700", fontSize: 14 },
  text: { flex: 1, fontSize: 16, color: colors.text, fontWeight: "600" },
  icon: { fontSize: 22, color: colors.success, fontWeight: "700" },
});
