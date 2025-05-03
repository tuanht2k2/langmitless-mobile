import color from "@/assets/styles/color";
import React from "react";
import { View, ViewStyle } from "react-native";

interface IProps {
  style?: ViewStyle;
  direction: "VERTICAL" | "HORIZONTAL";
}

function Divider(props: IProps) {
  return (
    <View
      style={{
        width: props.direction == "HORIZONTAL" ? "100%" : 1,
        height: props.direction == "HORIZONTAL" ? 1 : "100%",
        backgroundColor: color.grey2,
        ...props.style,
      }}
    ></View>
  );
}

export default Divider;
