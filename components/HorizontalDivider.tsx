import color from "@/assets/styles/color";
import React from "react";
import { View, ViewStyle } from "react-native";

interface IProps {
  style?: ViewStyle;
}

function HorizontalDivider(props: IProps) {
  return (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: color.grey2,
        ...props.style,
      }}
    ></View>
  );
}

export default HorizontalDivider;
