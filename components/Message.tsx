import React from "react";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AvatarComponent from "./Avatar";
import color from "@/assets/styles/color";

function MessageComponent(props: ResponseInterfaces.IMessageResponse) {
  const currentAccount = useSelector((state: RootState) => state.auth.account);

  const isCurrentAccount: boolean = props.createdBy?.id === currentAccount?.id;

  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: isCurrentAccount ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          gap: 5,
          display: "flex",
          flexDirection: isCurrentAccount ? "row-reverse" : "row",
          alignItems: "center",
        }}
      >
        <AvatarComponent
          accountUrl={props.createdBy?.id}
          imageUrl={props.createdBy?.profileImage}
        />
        <Text
          style={{
            padding: 10,
            backgroundColor: isCurrentAccount
              ? color.primary
              : color.extraLightGrey,
            color: isCurrentAccount ? color.white : color.black,
            borderRadius: 10,
          }}
        >
          {props.content}
        </Text>
      </View>
    </View>
  );
}

export default MessageComponent;
