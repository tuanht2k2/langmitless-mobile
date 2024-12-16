import React from "react";
import { ComponentInterfaces } from "@/constants/component";
import { Image, Text, TouchableOpacity, View } from "react-native";
import IconButtonComponent from "./IconButton";
import { Icon } from "@rneui/themed";
import { useRouter } from "expo-router";

function MenuItem(props: ComponentInterfaces.IMenuItem) {
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
      {props.img && (
        <Image
          source={props.img}
          style={{ height: 40, width: 40, objectFit: "contain" }}
        />
      )}
      {props.icon && <Icon name={props.icon || ""} color={props.iconColor} />}
      <Text
        style={{
          color: props.labelColor,
          fontWeight: "bold",
          fontSize: 12,
        }}
      >
        {props.name}
      </Text>
    </TouchableOpacity>
  );
}

export default MenuItem;
