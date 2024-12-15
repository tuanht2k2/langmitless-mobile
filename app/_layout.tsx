import React from "react";
import { Slot } from "expo-router";
import * as Linking from "expo-linking";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";

import "expo-dev-client";

export default function AppLayout() {
  return <Slot />;
}
