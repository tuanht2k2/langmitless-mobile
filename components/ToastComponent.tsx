import { ComponentInterfaces } from "@/constants/component";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import React from "react";

function ToastComponent(props: ComponentInterfaces.IToast) {
  return (
    <TouchableWithoutFeedback
      style={{
        padding: 10,
        backgroundColor: "white",
        borderRadius: 5,
        gap: 10,
      }}
      onPress={props.onPress || (() => {})}
    >
      <Text style={{ color: props.titleColor }}>{props.title}</Text>
      <Text style={{ color: props.contentColor }}>{props.title}</Text>
    </TouchableWithoutFeedback>
  );
}

export default ToastComponent;
