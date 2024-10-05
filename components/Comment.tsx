import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AvatarComponent from "./Avatar";
import { Interfaces } from "@/data/interfaces/model";
import { Link, useRouter } from "expo-router";
import color from "@/assets/styles/color";
import { useDispatch } from "react-redux";
import { closeModal } from "@/redux/reducers/globalSlide";

function CommentComponent(props: Interfaces.IComment) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNavigateAccount = (id: string) => {
    if (!id) return;
    router.push(`/account/${id}`);
    dispatch(closeModal());
  };

  return (
    <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
      <AvatarComponent
        imageUrl={props.createdBy?.profileImage}
        accountUrl={props.createdBy?.id}
      />
      <View
        style={{
          gap: 5,
          backgroundColor: color.extraLightGrey,
          padding: 8,
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            handleNavigateAccount(props.createdBy?.id || "");
          }}
        >
          <Text style={{ fontWeight: "600" }}>
            {props.createdBy?.displayName}
          </Text>
        </TouchableOpacity>
        <Text>{props.content}</Text>
      </View>
    </View>
  );
}

export default CommentComponent;
