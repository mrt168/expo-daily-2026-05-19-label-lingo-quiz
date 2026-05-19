import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { labels } from "../../data/labels";
import LabelCard from "../../components/LabelCard";
import { useApp } from "../../context/AppContext";
import { colors, spacing } from "../../constants/theme";

export default function LibraryScreen() {
  const router = useRouter();
  const { state } = useApp();
  const total = labels.length;
  const cleared = state.clearedLabels.length;

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="library-screen">
      <Text style={styles.title}>ラベル図鑑</Text>
      <Text style={styles.sub}>
        {cleared} / {total} クリア
      </Text>

      <View style={styles.grid}>
        {labels.map((l) => {
          const isCleared = state.clearedLabels.includes(l.id);
          return (
            <TouchableOpacity
              key={l.id}
              onPress={() => router.push({ pathname: "/quiz", params: { labelId: l.id } })}
              style={styles.cell}
              accessibilityLabel={`library-card-${l.id}`}
              activeOpacity={0.85}
            >
              <LabelCard label={l} size="sm" cleared={isCleared} />
            </TouchableOpacity>
          );
        })}
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: colors.textSub,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  cell: { width: "47%" },
});
