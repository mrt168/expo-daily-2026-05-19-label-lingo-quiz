import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../constants/theme";

export default function StreakBadge({ count }: { count: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.text}>{count}日</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  fire: { fontSize: 16 },
  text: { marginLeft: 4, fontWeight: "700", color: colors.accent, fontSize: 14 },
});
