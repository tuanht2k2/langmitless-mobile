import {
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import React from "react";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import LoadingLayout from "@/components/Loading";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HireNotificationModalComponent from "@/components/HireNotificationModalComponent";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import ChatbotComponent from "@/components/Chatbot";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// const linking = {
//   prefixes: ["engfinity://", "https://engfinity.com"],
//   config: {
//     screens: {
//       "(private)": {
//         initialRouteName: "(tab-layout)",
//         screens: {
//           "(tab-layout)": {
//             screens: {
//               Home: "/",
//             },
//           },
//           "(header-layout)": {
//             screens: {
//               Payment: "/payment",
//             },
//           },
//         },
//       },
//     },
//   },
// };

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Provider store={store}>
        <LoadingLayout>
          <GestureHandlerRootView>
            {/* <NavigationContainer linking={linking} independent> */}
            <Stack
              screenOptions={{
                presentation: "card",
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(private)" options={{ headerShown: false }} />
              <Stack.Screen name="(public)" options={{ headerShown: false }} />
            </Stack>
            {/* </NavigationContainer> */}
            <ChatbotComponent />
            <OverlayActivityIndicator />
            <HireNotificationModalComponent />
          </GestureHandlerRootView>
        </LoadingLayout>
      </Provider>
    </ThemeProvider>
  );
}
