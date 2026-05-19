import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useApp, todayStr } from "../../context/AppContext";
import { getTodayLabel, labels } from "../../data/labels";
import LabelCard from "../../components/LabelCard";
import StreakBadge from "../../components/StreakBadge";
import { colors, radii, spacing } from "../../constants/theme";

export default function HomeScreen() {
  const { state, ready } = useApp();
  const router = useRouter();
  const date = todayStr();
  const isFirstTime = !state.hasOpenedBefore;
  const todayLabel = useMemo(() => getTodayLabel(date, isFirstTime), [date, isFirstTime]);

  if (!ready) return <View style={styles.container} />;

  const learnedWords = state.results.reduce((sum, r) => sum + (5 - r.wrongWords.length), 0);

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="home-screen">
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>🏷️ ラベル英単語</Text>
          <Text style={styles.subtitle}>シャンプー・メニューで覚える英語</Text>
        </View>
        <StreakBadge count={state.streak} />
      </View>

      <View style={styles.todayBox}>
        <Text style={styles.todayHeading}>今日のラベル</Text>
        <LabelCard label={todayLabel} size="lg" />
        <Text style={styles.todayHint}>5つの英単語にチャレンジ</Text>
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => router.push({ pathname: "/quiz", params: { labelId: todayLabel.id } })}
        accessibilityLabel="start-quiz-button"
        activeOpacity={0.85}
      >
        <Text style={styles.startBtnText}>クイズ開始 ▶</Text>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{learnedWords}</Text>
          <Text style={styles.statLabel}>覚えた単語</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{state.clearedLabels.length}</Text>
          <Text style={styles.statLabel}>クリア済みラベル</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{state.totalPlays}</Text>
          <Text style={styles.statLabel}>総プレイ回数</Text>
        </View>
      </View>

      <Text style={styles.libraryHeading}>ラベル図鑑から</Text>
      <View style={styles.libraryRow}>
        {labels.slice(1, 5).map((l) => (
          <View key={l.id} style={styles.smallCard}>
            <LabelCard label={l} size="sm" cleared={state.clearedLabels.includes(l.id)} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.bg,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerLeft: { flex: 1 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  todayBox: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  todayHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accent,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  todayHint: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.textSub,
    textAlign: "center",
  },
  startBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: radii.pill,
    alignItems: "center",
    marginBottom: spacing.xl,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  startBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statNum: { fontSize: 22, fontWeight: "700", color: colors.text },
  statLabel: { fontSize: 11, color: colors.textSub, marginTop: 2 },
  libraryHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  libraryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  smallCard: { width: "47%" },
});
