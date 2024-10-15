import React from "react";
import { ActivityIndicator, View } from "react-native";

function FullScreenLoadingComponent(props: { size?: number }) {
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size={props.size} />
    </View>
  );
}

export default FullScreenLoadingComponent;
