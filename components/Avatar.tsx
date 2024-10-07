import color from "@/assets/styles/color";
import { closeModal } from "@/redux/reducers/globalSlide";
import { useRouter } from "expo-router";

import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

interface AvatarProps {
  imageUrl?: string;
  accountUrl?: string;
  size?: number;
}

export default function AvatarComponent(props: AvatarProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNavigation = () => {
    if (!props.accountUrl) return;
    router.push(`/account/${props.accountUrl}`);
    dispatch(closeModal());
  };

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      style={{
        height: props.size || 30,
        width: props.size || 30,
        borderWidth: 1,
        borderColor: color.grey,
        ...styles.profileImageWrapper,
      }}
    >
      <Image
        source={
          props.imageUrl
            ? { uri: props.imageUrl }
            : require("@/assets/images/default_avt.png")
        }
        style={styles.profileImage}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileImageWrapper: {
    borderRadius: 50,
    overflow: "hidden",
    cursor: "pointer",
    // borderBlockColor: "#0b83bf",
    // borderWidth: 1,
  },
  profileImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
});
