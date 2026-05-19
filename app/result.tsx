import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getLabelById } from "../data/labels";
import { useApp, todayStr } from "../context/AppContext";
import ShareCard from "../components/ShareCard";
import { colors, radii, spacing } from "../constants/theme";

export default function ResultScreen() {
  const params = useLocalSearchParams<{ labelId?: string; score?: string; wrongWords?: string }>();
  const router = useRouter();
  const { state } = useApp();

  const label = useMemo(() => getLabelById(params.labelId || "starter"), [params.labelId]);
  const score = parseInt(params.score || "0", 10);
  const wrongWords = (params.wrongWords || "").split(",").filter(Boolean);

  if (!label) {
    return (
      <View style={styles.container}>
        <Text>結果が見つかりません</Text>
      </View>
    );
  }

  const results = label.words.map((w) => !wrongWords.includes(w.en));
  const date = todayStr();

  const message =
    score === 5
      ? "🎉 パーフェクト！全問正解！"
      : score >= 3
        ? "✨ よくできました！"
        : "📚 もう少し！明日もがんばろう";

  const onShare = async () => {
    try {
      await Share.share({
        message: `🏷️ ラベル英単語クイズ\n「${label.title}」スコア: ${score}/5\n連続 ${state.streak}日達成中！\n#ラベル英単語クイズ`,
      });
    } catch (e) {
      console.warn("share failed", e);
    }
  };

  const onAgain = () => {
    router.replace("/(tabs)");
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="result-screen">
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.scoreLine}>
        スコア <Text style={styles.scoreNum}>{score}</Text> / 5
      </Text>

      <View style={styles.shareCardWrap}>
        <ShareCard
          label={label}
          words={label.words}
          results={results}
          score={score}
          streak={state.streak}
          date={date}
        />
      </View>

      <TouchableOpacity
        style={styles.shareBtn}
        onPress={onShare}
        accessibilityLabel="share-button"
        activeOpacity={0.85}
      >
        <Text style={styles.shareBtnText}>📤 シェアする</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.againBtn}
        onPress={onAgain}
        accessibilityLabel="play-again-button"
        activeOpacity={0.85}
      >
        <Text style={styles.againBtnText}>明日もやる ▶</Text>
      </TouchableOpacity>

      {Platform.OS === "web" && (
        <Text style={styles.note}>※実機ではSNSアプリ選択画面が開きます</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.bg,
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.md,
    textAlign: "center",
  },
  scoreLine: {
    fontSize: 14,
    color: colors.textSub,
    marginVertical: spacing.sm,
  },
  scoreNum: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.accent,
  },
  shareCardWrap: {
    width: "100%",
    marginVertical: spacing.lg,
  },
  shareBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    alignItems: "center",
    width: "100%",
    marginBottom: spacing.md,
  },
  shareBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  againBtn: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 2,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    alignItems: "center",
    width: "100%",
  },
  againBtnText: { color: colors.accent, fontSize: 16, fontWeight: "700" },
  note: { fontSize: 11, color: colors.textSub, marginTop: spacing.md },
});
