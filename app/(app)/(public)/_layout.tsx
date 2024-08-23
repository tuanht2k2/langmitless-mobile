import {
  Redirect,
  Stack,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";

export default function PublicLayout() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const isLogin = useSelector((state: RootState) => state.auth.isLogin);

  useEffect(() => {
    if (rootNavigationState && isLogin) {
      router.push("/");
    }
  }, [isLogin]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
