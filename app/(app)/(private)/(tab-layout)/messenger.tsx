import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import SearchAccountModalComponent from "@/components/SearchAccountModal";
import { Icon } from "@rneui/themed";
import color from "@/assets/styles/color";
import { useRouter } from "expo-router";
import messengerService from "@/services/messengerService";
import Toast from "react-native-toast-message";
import CommonService from "@/services/CommonService";

export default function MessengerScreen() {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const router = useRouter();

  const showSearchVisible = () => {
    setIsSearchVisible(true);
  };

  const hideSearchVisible = () => {
    setIsSearchVisible(false);
  };

  const openMessenger = async (targetAccount: string) => {
    const res = await messengerService.findPersonalByMembers(targetAccount);
    const messengerId: string = res?.data?.data;
    if (!messengerId || res.status == 400) {
      CommonService.showToast("error", "Lỗi");
      return;
    }
    hideSearchVisible();
    router.push(`/messenger/${messengerId}`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Toast />
      <SearchAccountModalComponent
        onClose={hideSearchVisible}
        onOpen={showSearchVisible}
        visible={isSearchVisible}
        onClick={openMessenger}
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
        <Text>Tìm kiếm</Text>
      </TouchableOpacity>
    </View>
  );
}
