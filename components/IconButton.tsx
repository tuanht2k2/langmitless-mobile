import { Icon } from "@rneui/themed";
import React from "react";
import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  onPress?: () => void;
  icon?: string;
  iconColor?: string;
  label?: string;
  labelColor?: string;
  size?: number;
  color?: string;
}

function IconButtonComponent(props: Props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        borderRadius: props.label ? 15 : 100,
        gap: 10,
        padding: props.label ? 10 : 5,
        backgroundColor: props.color,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {props.icon && (
        <Icon
          name={props.icon}
          color={props.iconColor}
          size={props.size || 30}
        />
      )}
      {props.label && (
        <Text
          style={{
            color: props.labelColor,
            fontSize: props.size ? props.size / 2 : 15,
            fontWeight: "500",
          }}
        >
          {props.label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default IconButtonComponent;
