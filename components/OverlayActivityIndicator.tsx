import color from "@/assets/styles/color";
import { RootState } from "@/redux/store";
import React from "react";
import { ActivityIndicator, Image, Modal, View } from "react-native";
import { useSelector } from "react-redux";

//@ts-ignore
import loadingAnimation from "@/assets/animation/loading.gif";
//@ts-ignore
import searchingAnimation from "@/assets/animation/search-animation.gif";

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
        {/* <ActivityIndicator color={color.blue1} size={30} /> */}
        <Image source={loadingAnimation} style={{ height: 60, width: 60 }} />
      </View>
    </Modal>
  );
}

export default OverlayActivityIndicator;
