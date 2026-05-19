import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "../context/AppContext";
import { colors } from "../constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.bg },
            headerTitleStyle: { fontWeight: "700" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="quiz" options={{ title: "クイズ", presentation: "card" }} />
          <Stack.Screen name="result" options={{ title: "結果", headerBackVisible: false }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
