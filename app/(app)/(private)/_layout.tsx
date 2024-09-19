import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loadAccount, login, logout } from "@/redux/reducers/authSlice";
import accountService from "@/services/accountService";
import { loaded } from "@/redux/reducers/globalSlide";

interface ITokenData {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  id: string;
}

export default function PrivateLayout() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("token")
      .then((token) => {
        if (!token) {
          handleLogout();
          return;
        }
        const data: ITokenData = jwtDecode(token);

        accountService
          .getAccount(data?.id)
          .then((res) => {
            const data = res.data?.data;
            dispatch(loadAccount(data));
            dispatch(login());
          })
          .catch(() => {
            handleLogout();
          })
          .finally(() => {
            dispatch(loaded());
          });
      })
      .catch(() => {});

    return () => {};
  }, []);

  const handleLogout = () => {
    AsyncStorage.clear().then(() => {
      dispatch(logout());
      dispatch(loaded());
      router.replace("/login");
    });
  };

  return (
    <Stack
      screenOptions={{
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(header-layout)" options={{ headerShown: false }} />
      <Stack.Screen name="(tab-layout)" options={{ headerShown: false }} />
    </Stack>
  );
}
