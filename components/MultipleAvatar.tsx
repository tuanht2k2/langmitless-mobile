import color from "@/assets/styles/color";
import { closeModal } from "@/redux/reducers/globalSlide";
import { useRouter } from "expo-router";

import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

interface AvatarProps {
  images: string[];
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  rowLength?: number;
}

export default function MultipleAvatarComponent(props: AvatarProps) {
  const size: number = props.size || 50;

  return (
    <TouchableOpacity
      style={{
        height: size,
        width: size,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
        ...styles.wrapper,
      }}
    >
      {props.images.map((image, index) => (
        <View
          key={index}
          style={{ ...styles.imageWrapper, width: size / props.images.length }}
        >
          <Image
            source={
              image
                ? { uri: image }
                : require("@/assets/images/default_avt.png")
            }
            style={styles.image}
          />
        </View>
      ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageWrapper: {
    padding: 5,
  },
  image: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    borderRadius: 100,
  },
});
