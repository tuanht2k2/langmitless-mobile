import { Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SearchAccountModalComponent from "@/components/SearchAccountModal";
import { Icon } from "@rneui/themed";
import color from "@/assets/styles/color";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function FriendRequestScreen() {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const router = useRouter();

  const showSearchVisible = () => {
    setIsSearchVisible(true);
  };

  const hideSearchVisible = () => {
    setIsSearchVisible(false);
  };

  const viewAccount = async (targetAccount: string) => {
    router.push(`/account/${targetAccount}`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Toast />
      <SearchAccountModalComponent
        onClose={hideSearchVisible}
        onOpen={showSearchVisible}
        visible={isSearchVisible}
        onClick={viewAccount}
      />
      <TouchableOpacity
        onPress={showSearchVisible}
        style={{
          gap: 3,
          display: "flex",
          flexDirection: "row",
          backgroundColor: color.extraLightGrey,
          borderRadius: 10,
          padding: 10,
        }}
      >
        <Icon name="search" />
        <Text>Tìm kiếm...</Text>
      </TouchableOpacity>
    </View>
  );
}
