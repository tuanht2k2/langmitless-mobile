import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
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
import hireService from "@/services/hireService";
import { RequestInterfaces } from "@/data/interfaces/request";
import { useRouter } from "expo-router";
// import { useNavigation } from "expo-router";

const { height } = Dimensions.get("window");

const HireNotificationModalComponent = () => {
  const hire = useSelector((state: RootState) => state.global.hireNotification);
  const dispatch = useDispatch();
  const translateY = useSharedValue(height);

  const router = useRouter();

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

  const updateHiredStatus = async (status: "ACCEPTED" | "REJECTED") => {
    if (!hire) return;
    const request: RequestInterfaces.IEditHireRequest = {
      id: hire?.id,
      status,
      teacherId: hire.teacher?.id,
    };
    try {
      hireService.updateStatus(request);
    } catch (error) {
      throw error;
    }
  };

  const rejectHired = () => {
    dispatch(clearHired());
    try {
      updateHiredStatus("REJECTED");
    } catch (error) {
      throw error;
    }
  };

  const acceptHired = () => {
    dispatch(clearHired());
    try {
      updateHiredStatus("ACCEPTED");
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (hire) {
      componentOpenModal();
    } else {
      componentCloseModal();
    }
  }, [hire]);

  return (
    <Modal
      visible={!!hire}
      animationType="slide"
      transparent
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          height: "100%",
          width: "100%",
        }}
      >
        <View
          style={{
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: color.blue1,
            width: "100%",
          }}
        >
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
              imageUrl={hire?.createdBy?.profileImage}
              size={100}
            />
            <View style={{}}>
              <Text style={{ color: color.white1 }}>
                <Text style={{ color: color.yellow1, fontWeight: "bold" }}>
                  {hire?.createdBy?.name}
                </Text>{" "}
                đã gửi yêu cầu thuê
              </Text>

              <Text style={{ color: color.white1 }}>
                Thời lượng:{" "}
                <Text style={{ color: color.yellow1, fontWeight: "bold" }}>
                  {hire?.totalTime}h
                </Text>
              </Text>

              <Text style={{ color: color.white1 }}>
                Giá gốc:{" "}
                <Text style={{ color: color.yellow1, fontWeight: "bold" }}>
                  {hire?.cost}
                </Text>
              </Text>

              <Text style={{ color: color.white1 }}>
                Phí:{" "}
                <Text style={{ color: color.yellow1, fontWeight: "bold" }}>
                  {hire?.cost ? Math.floor((hire?.cost * 20) / 100) : 0}
                </Text>{" "}
                VND
              </Text>

              <Text style={{ color: color.white1 }}>
                Thu nhập:{" "}
                <Text style={{ color: color.yellow1, fontWeight: "bold" }}>
                  {hire?.cost
                    ? hire?.cost - Math.floor((hire?.cost * 20) / 100)
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
            <Button
              title="Từ chối"
              onClick={rejectHired}
              style={{ backgroundColor: color.yellow1 }}
              textColor={color.red3}
            />
            <Button
              title="Chấp nhận"
              style={{ backgroundColor: color.yellow1 }}
              onClick={acceptHired}
              textColor={color.success3}
            />
          </View>
        </View>
      </View>
    </Modal>
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
    fontSize: 18,
    fontWeight: "bold",
    color: color.yellow1,
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
