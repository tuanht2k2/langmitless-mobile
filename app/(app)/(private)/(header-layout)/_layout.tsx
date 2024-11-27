import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function HeaderLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      {/* <Stack.Screen
        name="image/[id]"
        options={{
          headerTitle: "Ảnh",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
        }}
      /> */}
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f8f9fa",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
