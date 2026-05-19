import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useApp } from "../../context/AppContext";
import { colors, radii, spacing } from "../../constants/theme";

export default function SettingsScreen() {
  const { state, resetAll } = useApp();

  const onReset = () => {
    const doReset = () => {
      resetAll();
    };
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("学習データをすべて削除しますか？")) {
        doReset();
      }
      return;
    }
    Alert.alert("リセット", "学習データをすべて削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      { text: "削除", style: "destructive", onPress: doReset },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="settings-screen">
      <Text style={styles.title}>設定</Text>

      <View style={styles.statBox}>
        <Text style={styles.statHeading}>あなたの記録</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>連続日数</Text>
          <Text style={styles.statValue}>🔥 {state.streak} 日</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>クリア済みラベル</Text>
          <Text style={styles.statValue}>{state.clearedLabels.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>総プレイ回数</Text>
          <Text style={styles.statValue}>{state.totalPlays}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>復習中の単語</Text>
          <Text style={styles.statValue}>{state.wrongQueue.length}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoHeading}>このアプリについて</Text>
        <Text style={styles.infoText}>
          シャンプー、お菓子、メニュー…身近な「ラベル」から英単語を学ぶクイズアプリです。
        </Text>
        <Text style={styles.infoText}>毎日1分、5問のクイズで少しずつ語彙を増やそう！</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <TouchableOpacity
        style={styles.resetBtn}
        onPress={onReset}
        accessibilityLabel="reset-button"
        activeOpacity={0.85}
      >
        <Text style={styles.resetBtnText}>学習データをリセット</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.bg,
    flexGrow: 1,
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: spacing.lg },
  statBox: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statHeading: { fontSize: 13, fontWeight: "700", color: colors.accent, marginBottom: spacing.md },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  statLabel: { color: colors.textSub, fontSize: 13 },
  statValue: { color: colors.text, fontWeight: "700", fontSize: 14 },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  infoHeading: { fontSize: 13, fontWeight: "700", color: colors.accent, marginBottom: spacing.sm },
  infoText: { fontSize: 13, color: colors.text, lineHeight: 20, marginBottom: 4 },
  version: { fontSize: 11, color: colors.textSub, marginTop: spacing.md },
  resetBtn: {
    borderColor: colors.error,
    borderWidth: 1,
    backgroundColor: colors.errorBg,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  resetBtnText: { color: colors.error, fontWeight: "700", fontSize: 14 },
});
