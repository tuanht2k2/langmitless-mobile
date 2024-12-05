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
import { closeModal, clearHired } from "@/redux/reducers/globalSlide";
import AvatarComponent from "./Avatar";
import Button from "./Button";
// import { useNavigation } from "expo-router";

const { height } = Dimensions.get("window");

const HireNotificationModalComponent = () => {
  const hire = useSelector((state: RootState) => state.global.hireNotification);
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

  const dispatchClearHired = () => {
    dispatch(clearHired());
  };

  const acceptHired = () => {
    dispatchClearHired();
  };

  useEffect(() => {
    if (hire) {
      componentOpenModal();
    } else {
      componentCloseModal();
    }
  }, [hire]);

  return (
    <>
      {hire && (
        <View style={StyleSheet.absoluteFill}>
          <PanGestureHandler>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <View style={styles.header}>
                <Text style={styles.title}>Bạn có yêu cầu mới</Text>
              </View>
              <View
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  gap: 20,
                }}
              >
                <AvatarComponent
                  imageUrl={hire.createdBy?.profileImage}
                  size={100}
                />
                <View style={{}}>
                  <Text>
                    <Text style={{ color: color.pink3, fontWeight: "bold" }}>
                      {hire.createdBy?.name}
                    </Text>{" "}
                    đã gửi yêu cầu thuê
                  </Text>

                  <Text>
                    Thời lượng:{" "}
                    <Text style={{ color: color.pink3, fontWeight: "bold" }}>
                      {hire.totalTime}h
                    </Text>
                  </Text>

                  <Text>
                    Giá gốc:{" "}
                    <Text style={{ color: color.pink3, fontWeight: "bold" }}>
                      {hire.cost}
                    </Text>
                  </Text>

                  <Text>
                    Phí:{" "}
                    <Text style={{ color: color.pink3, fontWeight: "bold" }}>
                      {(hire.cost || 0 * 20) > 0
                        ? Math.floor((hire.cost || 0 * 20) / 100)
                        : 0}
                    </Text>{" "}
                    VND
                  </Text>

                  <Text>
                    Thu nhập:{" "}
                    <Text style={{ color: color.pink3, fontWeight: "bold" }}>
                      {hire.cost || 0 - (hire.cost || 0 * 20) > 0
                        ? Math.floor((hire.cost || 0 * 20) / 100)
                        : 0}
                    </Text>
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 20,
                  marginTop: 20,
                }}
              >
                <Button title="Từ chối" onClick={dispatchClearHired} />
                <Button
                  title="Chấp nhận"
                  style={{ backgroundColor: color.success3 }}
                  onClick={acceptHired}
                />
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

export default HireNotificationModalComponent;
