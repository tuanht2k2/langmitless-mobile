import color from "@/assets/styles/color";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, Image, View } from "react-native";

function ImageScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View
      style={{ height: "100%", width: "100%", backgroundColor: color.black }}
    >
      <Image
        source={{
          uri: process.env.EXPO_PUBLIC_BASE_S3_BUCKET?.concat(id as string),
        }}
        style={{ height: "100%", objectFit: "contain" }}
      />
    </View>
  );
}

export default ImageScreen;
