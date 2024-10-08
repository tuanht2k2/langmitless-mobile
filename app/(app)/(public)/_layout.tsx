import {
  Redirect,
  Stack,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";
import React from "react";

export default function PublicLayout() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const isLogin = useSelector((state: RootState) => state.auth.isLogin);

  useEffect(() => {
    if (rootNavigationState && isLogin) {
      router.replace("/");
    }
  }, [isLogin]);

  return (
    <Stack
      screenOptions={{
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
