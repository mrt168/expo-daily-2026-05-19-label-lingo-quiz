import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { labels } from "../../data/labels";
import { useApp } from "../../context/AppContext";
import { colors, radii, spacing } from "../../constants/theme";

export default function ReviewScreen() {
  const { state, removeWrongWord } = useApp();
  const allWords = useMemo(() => labels.flatMap((l) => l.words), []);
  const reviewWords = useMemo(
    () => state.wrongQueue.map((en) => allWords.find((w) => w.en === en)).filter(Boolean),
    [state.wrongQueue, allWords],
  );

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="review-screen">
      <Text style={styles.title}>復習リスト</Text>
      <Text style={styles.sub}>間違えた単語をチェックして覚えよう</Text>

      {reviewWords.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyText}>復習する単語はありません！</Text>
          <Text style={styles.emptySub}>クイズで間違えた単語がここに表示されます</Text>
        </View>
      ) : (
        reviewWords.map((w) =>
          w ? (
            <View key={w.en} style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.en}>{w.en}</Text>
                <Text style={styles.ja}>{w.ja}</Text>
                {w.hint && <Text style={styles.hint}>💡 {w.hint}</Text>}
              </View>
              <TouchableOpacity
                onPress={() => removeWrongWord(w.en)}
                style={styles.removeBtn}
                accessibilityLabel={`remove-${w.en}`}
                activeOpacity={0.8}
              >
                <Text style={styles.removeBtnText}>✓ 覚えた</Text>
              </TouchableOpacity>
            </View>
          ) : null,
        )
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
  title: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 4 },
  sub: { fontSize: 13, color: colors.textSub, marginBottom: spacing.lg },
  empty: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: 16, fontWeight: "700", color: colors.text },
  emptySub: { fontSize: 12, color: colors.textSub, marginTop: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  rowText: { flex: 1 },
  en: { fontSize: 18, fontWeight: "700", color: colors.text },
  ja: { fontSize: 13, color: colors.textSub, marginTop: 2 },
  hint: { fontSize: 11, color: colors.textSub, marginTop: 2 },
  removeBtn: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  removeBtnText: { color: colors.success, fontWeight: "700", fontSize: 12 },
});
