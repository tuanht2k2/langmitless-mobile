import React from "react";
import { ComponentInterfaces } from "@/constants/component";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation, useRouter } from "expo-router";
import color from "@/assets/styles/color";
// dùng bảng màu bạn đã đưa

function MenuItem(props: ComponentInterfaces.IMenuItem) {
  const router = useRouter();
  const navigation = useNavigation();

  const handleNavigate = (path: string) => {
    //@ts-ignore
    router.push(path);
  };

  return (
    <TouchableOpacity
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f4f7",
        borderRadius: 12,
        shadowColor: color.black4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
        width: 80,
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
          style={{
            height: 28,
            width: 28,
            resizeMode: "contain",
            marginBottom: 6,
          }}
        />
      )}
      {props.icon && (
        <Icon
          name={props.icon}
          color={props.iconColor || color.primary3}
          size={28}
          style={{ marginBottom: 6 }}
        />
      )}
      <Text
        style={{
          color: props.labelColor || color.textBlack,
          fontWeight: "600",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        {props.name}
      </Text>
    </TouchableOpacity>
  );
}

export default MenuItem;
