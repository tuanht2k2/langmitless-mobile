import color from "@/assets/styles/color";
import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

interface ICardProps {
  children?: ReactNode;
  styles?: ViewStyle;
}

function Card(props: ICardProps) {
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: color.white1,
        shadowColor: color.black1,
        borderWidth: 1,
        borderColor: color.grey1,
        ...props.styles,
      }}
    >
      {props.children}
    </View>
  );
}

export default Card;
