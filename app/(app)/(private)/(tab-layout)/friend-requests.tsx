import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchAccountModalComponent from "@/components/SearchAccountModal";
import { Icon } from "@rneui/themed";
import color from "@/assets/styles/color";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import accountService from "@/services/accountService";
import relationshipService from "@/services/relationshipService";
import { ResponseInterfaces } from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import FullScreenLoadingComponent from "@/components/FullScreenActivityIndicator";
import AvatarComponent from "@/components/Avatar";

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

  const [loading, setLoading] = useState<boolean>(true);

  const [relationships, setRelationships] = useState<
    ResponseInterfaces.IRelationshipResponse[]
  >([]);

  const getFriendRequests = () => {
    relationshipService
      .getFriendRequests()
      .then((res) => {
        const relationships = res.data.data;
        if (!relationships || relationships.length == 0) return;
        setRelationships(relationships);
      })
      .catch(() => {
        CommonService.showToast("error", "Lỗi", "Lỗi máy chủ");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const navigateAccount = (id: string) => {
    if (!id) {
      CommonService.showToast("error", "Lỗi", "Lỗi máy chủ");
      return;
    }
    router.push(`/account/${id}`);
  };

  useEffect(() => {
    getFriendRequests();

    return () => {};
  }, []);

  return (
    <View style={{ padding: 20 }}>
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
      {loading && <FullScreenLoadingComponent />}
      {!loading && (
        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Icon name="person-add" color={color.primary} />
          <Text>Lời mời kết bạn</Text>
          <Text style={{ color: color.danger, fontWeight: "500" }}>
            {relationships?.length}
          </Text>
        </View>
      )}
      {!loading && relationships.length > 0 && (
        <ScrollView
          style={{
            paddingVertical: 15,
            maxHeight: Dimensions.get("screen").height - 130,
          }}
        >
          {relationships.map((request, index) => {
            return (
              <View
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 4,
                }}
              >
                <AvatarComponent
                  accountUrl={request.createdBy.id}
                  imageUrl={request.createdBy.profileImage}
                  size={40}
                />
                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                  onPress={() => {
                    navigateAccount(request.createdBy?.id || "");
                  }}
                >
                  <Text style={{ fontWeight: "500" }}>
                    {request.createdBy?.displayName}
                  </Text>
                  <Text> đã gửi lời mời kết bạn</Text>
                  <Icon
                    name="visibility"
                    style={{ marginLeft: 20 }}
                    color={color.warning}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
      {!loading && relationships.length == 0 && (
        <Text style={{ textAlign: "center" }}>
          Bạn chưa nhận được lời mời kết bạn nào
        </Text>
      )}

      <Toast />
    </View>
  );
}
