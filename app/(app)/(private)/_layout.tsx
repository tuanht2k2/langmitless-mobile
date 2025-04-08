import React, { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { loadAccount, login, logout } from "@/redux/reducers/authSlice";
import accountService from "@/services/accountService";
import { clearHired, loaded, noticeHired } from "@/redux/reducers/globalSlide";
import Toast, { ToastConfig } from "react-native-toast-message";
import { ResponseInterfaces } from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import useSocket from "@/utils/useSocket";
import { RootState } from "@/redux/store";
import { Audio } from "expo-av";
import { RequestInterfaces } from "@/data/interfaces/request";
import { AppState, AppStateStatus } from "react-native";
import { ComponentInterfaces } from "@/constants/component";
import ToastComponent from "@/components/ToastComponent";

interface ITokenData {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  id: string;
}

const toastConfig: ToastConfig = {
  // customToast: (props : ComponentInterfaces.IToast) => <ToastComponent {...props} />
};

export default function PrivateLayout() {
  const dispatch = useDispatch();
  const router = useRouter();

  const account = useSelector((state: RootState) => state.auth.account);

  const hireNotificationSoundRef = useRef<Audio.Sound | null>(null);

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
          .catch((err) => {
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

  const playNotificationAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/notification_sound.mp3")
    );
    await sound.playAsync();
  };

  const toggleHireNotificationAudio = async () => {
    if (!hireNotificationSoundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/warning_sound.mp3")
      );
      // await sound.setIsLoopingAsync(true);
      await sound.playAsync();
      hireNotificationSoundRef.current = sound;
    } else {
      hireNotificationSoundRef.current.stopAsync();
      hireNotificationSoundRef.current.unloadAsync();
    }
  };

  useEffect(() => {
    return () => {
      if (!hireNotificationSoundRef.current) return;
      hireNotificationSoundRef.current.unloadAsync();
    };
  }, []);

  const notice = (notification: ResponseInterfaces.INotificationResponse) => {
    CommonService.showToast("info", "Thông báo", notification.message, false);
    playNotificationAudio();
  };

  const updateStatus = (appState: AppStateStatus) => {
    const request: RequestInterfaces.IEditAccountStatusRequest = {
      id: account?.id,
      status: appState === "active" ? "ONLINE" : "OFFLINE",
    };
    try {
      accountService.updateStatus(request);
    } catch (error) {}
  };

  const hireListener = (hire: ResponseInterfaces.IHireResponse) => {
    if (!hire) return;
    if (account?.id === hire.teacher?.id) {
      if (hire.status && hire.status === "PENDING") {
        dispatch(noticeHired(hire));
        // toggleHireNotificationAudio();
        return;
      }
      if (hire.status === "ACCEPTED") {
        router.push(`/room/${hire.id}`);
      } else {
        dispatch(clearHired());
      }
    }
  };

  useSocket(`/topic/${account?.id}/notifications`, notice);
  useSocket(`/topic/teachers/${account?.id}`, hireListener);

  useEffect(() => {
    if (!account) return;
    AppState.addEventListener("change", updateStatus);

    return () => {};
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(header-layout)" options={{ headerShown: false }} />
        <Stack.Screen name="(tab-layout)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}
