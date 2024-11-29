import color from "@/assets/styles/color";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HeaderLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="payment"
        options={{
          headerTitle: "Nạp tiền",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          headerTintColor: color.textWhite2,
          headerBackground: () => (
            <LinearGradient
              colors={[color.primary5, color.pink1]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {},
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.textWhite2,
  },
});
