import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, radii, spacing } from "../constants/theme";
import { Label } from "../types";

type Props = {
  label: Label;
  size?: "sm" | "md" | "lg";
  locked?: boolean;
  cleared?: boolean;
  onPress?: () => void;
};

export default function LabelCard({ label, size = "md", locked, cleared, onPress }: Props) {
  const emojiSize = size === "lg" ? 64 : size === "md" ? 44 : 32;
  const titleSize = size === "lg" ? 20 : 14;
  const padding = size === "lg" ? spacing.xl : spacing.md;
  const card = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: locked ? colors.locked : label.color + "33",
          padding,
          borderColor: label.color,
        },
      ]}
    >
      <Text style={{ fontSize: emojiSize, opacity: locked ? 0.5 : 1, textAlign: "center" }}>
        {locked ? "🔒" : label.emoji}
      </Text>
      <Text
        style={[styles.title, { fontSize: titleSize, opacity: locked ? 0.5 : 1 }]}
        numberOfLines={1}
      >
        {label.title}
      </Text>
      {cleared && size !== "lg" && (
        <Text style={styles.cleared}>✓ クリア済み</Text>
      )}
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ flex: size === "sm" ? 1 : undefined }}>
        {card}
      </TouchableOpacity>
    );
  }
  return card;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  title: {
    marginTop: 8,
    color: colors.text,
    fontWeight: "700",
    textAlign: "center",
  },
  cleared: {
    marginTop: 4,
    color: colors.success,
    fontSize: 12,
    fontWeight: "600",
  },
});
