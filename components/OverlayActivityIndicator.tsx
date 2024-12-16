import color from "@/assets/styles/color";
import { RootState } from "@/redux/store";
import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import { useSelector } from "react-redux";

function OverlayActivityIndicator() {
  const isLoading = useSelector(
    (state: RootState) => state.global.isOverlayLoading
  );

  return (
    <Modal
      visible={isLoading}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: color.lightOverlay,
        }}
      >
        <ActivityIndicator color={color.blue1} size={30} />
      </View>
    </Modal>
  );
}

export default OverlayActivityIndicator;
