import React from "react";
import { ComponentIntefaces } from "@/constants/component";
import { Text, TouchableOpacity, View } from "react-native";
import IconButtonComponent from "./IconButton";
import { Icon } from "@rneui/themed";
import { useRouter } from "expo-router";

function MenuItem(props: ComponentIntefaces.IMenuItem) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <TouchableOpacity
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: 5,
        ...props.style,
      }}
      onPress={() => {
        if (props.to) {
          handleNavigate(props.to);
        } else props.onClick?.();
      }}
    >
      <Icon name={props.icon || ""} color={props.iconColor} />
      <Text style={{ color: props.labelColor, fontWeight: "bold" }}>
        {props.name}
      </Text>
    </TouchableOpacity>
  );
}

export default MenuItem;
