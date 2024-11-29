import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Icon } from "@rneui/themed";
import color from "@/assets/styles/color";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeModal } from "@/redux/reducers/globalSlide";
// import { useNavigation } from "expo-router";

const { height } = Dimensions.get("window");

const GlobalModalComponent = () => {
  const modal = useSelector((state: RootState) => state.global.modal);
  const dispatch = useDispatch();

  const translateY = useSharedValue(height);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const componentOpenModal = () => {
    translateY.value = withSpring(0);
  };

  const componentCloseModal = () => {
    translateY.value = withSpring(height);
  };

  const dispatchCloseModal = () => {
    dispatch(closeModal());
  };

  const handleGesture = (event: any) => {
    // if (event.nativeEvent.translationY > 100) {
    //   dispatchCloseModal();
    // }
  };

  useEffect(() => {
    if (modal) {
      componentOpenModal();
    } else {
      componentCloseModal();
    }
  }, [modal]);

  return (
    <>
      {modal && (
        <View style={StyleSheet.absoluteFill}>
          <PanGestureHandler onGestureEvent={handleGesture}>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {modal.type === "COMMENT" && "Bình luận"}
                </Text>
                <TouchableOpacity onPress={dispatchCloseModal}>
                  <Text>Đóng</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalWrapper: { position: "absolute", bottom: 0, left: 0 },
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: height,
    backgroundColor: "white",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 20,
    zIndex: 9999,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  main: { paddingBottom: 10 },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    // borderWidth: 1,
    borderColor: color.grey1,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 20,
    minWidth: 80,
  },
  footerButtonTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: color.grey1,
  },
});

export default GlobalModalComponent;
