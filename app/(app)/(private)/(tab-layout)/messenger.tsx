import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchAccountModalComponent from "@/components/SearchAccountModal";
import { Icon } from "@rneui/themed";
import color from "@/assets/styles/color";
import { useRouter } from "expo-router";
import messengerService from "@/services/messengerService";
import Toast from "react-native-toast-message";
import CommonService from "@/services/CommonService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { ActivityIndicator } from "react-native";
import MultipleAvatarComponent from "@/components/MultipleAvatar";
import { Interfaces } from "@/data/interfaces/model";
import IconButtonComponent from "@/components/IconButton";
import MultiSelectAccountComponent from "@/components/MultiSelectAccount";

export default function MessengerScreen() {
  const currentAccount = useSelector((state: RootState) => state.auth.account);

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

  const [loading, setLoading] = useState<boolean>(true);
  const [messengers, setMessengers] = useState<
    ResponseInterfaces.IMessengerResponse[] | null
  >();
  const [createGroupVisible, setCreateGroupVisible] = useState<boolean>(false);

  const getMessengers = () => {
    const request: RequestInterfaces.ISearchMessengerByAccountRequest = {
      accountId: currentAccount?.id,
    };

    messengerService
      .findMessengersByAccount(request)
      .then((res) => {
        const messengers: ResponseInterfaces.IMessengerResponse[] | null =
          res.data?.data;
        if (!messengers) return;
        setMessengers(messengers);
      })
      .catch(() => {
        CommonService.showToast("error", "Lỗi máy chủ");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getMessengerName = (
    members: Interfaces.IUser[],
    messengerType: "PERSONAL" | "GROUP" = "PERSONAL"
  ) => {
    if (messengerType == "PERSONAL") {
      const another = members.find(
        (member) => member.id !== currentAccount?.id
      );
      return another?.displayName;
    }
    return members.reduce((acc, member) => {
      if (member?.id !== currentAccount?.id)
        return acc + member?.displayName + ", ";
      return acc;
    }, "");
  };

  const getMessengerImage = (
    messengerType: "GROUP" | "PERSONAL" = "PERSONAL",
    accounts: Interfaces.IUser[],
    length: number
  ): string[] => {
    if (!accounts || accounts.length == 0) return [];
    if (messengerType == "PERSONAL") {
      const another = accounts.find(
        (account) => account.id !== currentAccount?.id
      );
      return [another?.profileImage || ""];
    }

    return accounts
      .slice(0, length)
      .map((account, index) => account.profileImage || "");
  };

  const createMessenger = (members: string[]) => {
    const request: RequestInterfaces.IEditMessengerRequest = {
      members,
      name: "Cuộc trò chuyện mới",
      type: "GROUP",
    };

    messengerService
      .create(request)
      .then(() => {
        CommonService.showToast(
          "info",
          "Thành công",
          "Tạo cuộc trò chuyện thành công!"
        );
      })
      .catch(() => {
        CommonService.showToast("error", "Thất bại", "Đã xảy ra lỗi");
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (!currentAccount) return;

    getMessengers();

    return () => {};
  }, [currentAccount]);

  return loading ? (
    <View
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ActivityIndicator />
    </View>
  ) : (
    <View style={{ padding: 20 }}>
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
      {messengers && messengers.length > 0 ? (
        <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 200,
            marginVertical: 20,
          }}
          scrollEnabled
        >
          {messengers.map((messenger, index) => (
            <TouchableOpacity
              onPress={() => {
                router.push(`/messenger/${messenger.id}`);
              }}
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <MultipleAvatarComponent
                  rowLength={2}
                  size={70}
                  images={
                    messenger.members
                      ? getMessengerImage(messenger.type, messenger.members, 4)
                      : []
                  }
                />
                <Text style={{ fontWeight: "600" }}>
                  {getMessengerName(messenger.members || [], messenger.type)}
                </Text>
              </View>
              <Text style={{ color: color.darkGrey, fontWeight: "500" }}>
                {CommonService.getFormattedISO(messenger.updatedAt)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text
          style={{ color: color.darkGrey, fontWeight: "bold", marginTop: 20 }}
        >
          Chưa có tin nhắn nào
        </Text>
      )}
      <Modal visible={createGroupVisible}>
        <MultiSelectAccountComponent
          onSubmit={createMessenger}
          onClose={() => {
            setCreateGroupVisible(false);
          }}
        />
      </Modal>
      <View style={{ position: "absolute", bottom: 0, right: 20 }}>
        <IconButtonComponent
          icon="add"
          color={color.primary}
          iconColor={color.white}
          onPress={() => {
            setCreateGroupVisible(true);
          }}
        />
      </View>
      <Toast />
    </View>
  );
}
