import React, { useEffect } from "react";

import { Video } from "expo-av";
import { useRef } from "react";

import { View, StyleSheet, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const LoadingLayout = ({ children }: any) => {
  const isLoading = useSelector((state: RootState) => state.global.isLoading);

  const videoRef = useRef(null);
  const videoSource = require("@/assets/animation/loading.mp4");

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
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={videoSource}
            isLooping
            shouldPlay
          />
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
    backgroundColor: "black",
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
