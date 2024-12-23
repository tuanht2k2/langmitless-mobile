import React, { useEffect } from "react";

import { Video } from "expo-av";
import { useRef } from "react";

import { View, StyleSheet, Dimensions, Image, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

//@ts-ignore
import logoImage from "@/assets/images/logo_remove_bgr.png";
import GlobalStyle from "@/assets/styles/globalStyles";
import color from "@/assets/styles/color";

const LoadingLayout = ({ children }: any) => {
  const isLoading = useSelector((state: RootState) => state.global.isLoading);

  useEffect(() => {}), [];

  return (
    <View
      style={
        isLoading
          ? { ...styles.loadingContainer, ...styles.container }
          : styles.container
      }
    >
      {isLoading && (
        <View
          style={{
            height: "100%",
            width: "100%",
            ...GlobalStyle.center,
            gap: 3,
          }}
        >
          <Image source={logoImage} style={{ height: 40, width: 40 }} />
          <Text style={{ color: color.success3 }}>langmitless</Text>
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
  },
  videoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  video: {
    height: 100,
    width: 100,
  },
});

export default LoadingLayout;
