import color from "@/assets/styles/color";
import { Icon } from "@rneui/themed";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface IProps {
  onClick?: () => void;
  style?: ViewStyle;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  textColor?: string;
  fontSize?: number;
  icon?: string;
  iconColor?: string;
}

function Button(props: IProps) {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 7,
        backgroundColor: props.disabled ? color.grey3 : color.pink1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        shadowColor: color.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        ...props.style,
      }}
      disabled={props.disabled}
      onPress={() => {
        if (props.loading) return;
        props.onClick?.();
      }}
    >
      {props.loading ? (
        <ActivityIndicator color={color.white1} />
      ) : (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {props.icon && (
            <Icon name={props.icon} color={props.iconColor || color.pink3} />
          )}
          <Text
            style={{
              color: props.textColor ? props.textColor : color.pink3,
              fontWeight: "bold",
              fontSize: props.fontSize || 14,
            }}
          >
            {props.title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Button;
