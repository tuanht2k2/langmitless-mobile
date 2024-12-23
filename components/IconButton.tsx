import color from "@/assets/styles/color";
import { Icon } from "@rneui/themed";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props {
  onPress?: () => void;
  icon?: string;
  image?: ImageSourcePropType;
  iconColor?: string;
  label?: string;
  labelColor?: string;
  size?: number;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

function IconButtonComponent(props: Props) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        borderRadius: props.label ? 15 : 100,
        gap: 10,
        padding: 10,
        backgroundColor: props.color,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...props.style,
      }}
    >
      {props.image && (
        <Image
          source={props.image}
          style={{
            height: props.size || 25,
            width: props.size || 25,
            objectFit: "contain",
          }}
        />
      )}
      {props.icon && (
        <Icon
          name={props.icon}
          color={props.disabled ? color.textGrey3 : props.iconColor}
          size={props.size || 25}
        />
      )}
      {props.label && (
        <Text
          style={{
            color: props.labelColor || color.textMain,
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
