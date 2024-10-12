import color from "@/assets/styles/color";
import AvatarComponent from "@/components/Avatar";
import IconButtonComponent from "@/components/IconButton";
import { Interfaces } from "@/data/interfaces/model";
import { RequestInterfaces } from "@/data/interfaces/request";
import { RootState } from "@/redux/store";
import accountService from "@/services/accountService";
import CommonService from "@/services/CommonService";
import relationshipService from "@/services/relationshipService";
import { Button, Icon } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

const AccountScreen = () => {
  const { id } = useLocalSearchParams();
  const currentAccount = useSelector((state: RootState) => state.auth.account);

  const [account, setAccount] = useState<Interfaces.IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [relationshipLoading, setRelationshipLoading] =
    useState<boolean>(false);
  const [relationship, setRelationship] = useState<
    "FRIEND" | "REQUESTED" | "RECEIVED" | "NONE"
  >("NONE");

  const sendFriendRequest = () => {
    setRelationshipLoading(true);
    const request: RequestInterfaces.IEditRelationshipRequest = {
      receiverId: id as string,
    };
    relationshipService
      .create(request)
      .then(() => {
        CommonService.showToast("info", "Thành công", "Đã gửi lời mời kết bạn");
        setRelationship("REQUESTED");
        getAccount(id as string);
      })
      .catch(() => {
        CommonService.showToast("error", "Thất bại", "Vui lòng thử lại");
      })
      .finally(() => {
        setRelationshipLoading(false);
      });
  };

  const acceptFriendRequest = () => {
    hideRelationshipModal();
    if (!account?.relationship) return;
    setRelationshipLoading(true);
    const request: RequestInterfaces.IEditRelationshipRequest = {
      id: account.relationship?.id,
    };

    relationshipService
      .acceptRequest(request)
      .then(() => {
        CommonService.showToast(
          "info",
          "Thành công",
          "Các bạn đã là bạn bè trên Connectify"
        );
        setRelationship("FRIEND");
        getAccount(id as string);
      })
      .catch(() => {
        CommonService.showToast("error", "Thất bại", "");
      })
      .finally(() => {
        setRelationshipLoading(false);
      });
  };

  const deleteRelationship = () => {
    hideRelationshipModal();
    if (!account?.relationship) return;
    setRelationshipLoading(true);
    const request: RequestInterfaces.ICommonDeleteRequest = {
      ids: [account.relationship?.id],
    };
    relationshipService
      .delete(request)
      .then(() => {
        CommonService.showToast("info", "Thành công", "Đã xóa lời mời");
        setRelationship("NONE");
        getAccount(id as string);
      })
      .catch(() => {
        CommonService.showToast("error", "Thất bại", "");
      })
      .finally(() => {
        setRelationshipLoading(false);
      });
  };

  const getRelationshipInfo = () => {
    switch (relationship) {
      case "FRIEND":
        return {
          label: "Bạn bè",
          icon: "group",
        };
      case "RECEIVED":
        return {
          label: "Đã gửi cho bạn lời mời",
          icon: "group-add",
        };
      case "REQUESTED":
        return {
          label: "Đã gửi lời mời",
          icon: "group-add",
        };
      default:
        return {
          label: "Kết bạn",
          icon: "group-add",
        };
    }
  };

  const [relationshipModalVisible, setRelationshipModalVisible] =
    useState(false);

  const showRelationshipModal = () => {
    setRelationshipModalVisible(true);
  };

  const hideRelationshipModal = () => {
    setRelationshipModalVisible(false);
  };

  const RelationshipModal = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          backgroundColor: color.lightOverlay,
        }}
      >
        <View style={{ position: "relative" }}>
          {relationship === "NONE" && (
            <Button
              buttonStyle={{
                backgroundColor: color.danger,
                borderRadius: 10,
                gap: 5,
              }}
              onPress={() => {
                hideRelationshipModal();
                sendFriendRequest();
              }}
            >
              <Icon name="person-add" color={color.white} />
              Gửi lời mời
            </Button>
          )}
          {relationship === "FRIEND" && (
            <Button
              buttonStyle={{
                backgroundColor: color.danger,
                borderRadius: 10,
                gap: 10,
              }}
              onPress={deleteRelationship}
            >
              <Icon name="person-remove" color={color.white} />
              Hủy kết bạn
            </Button>
          )}
          {relationship === "RECEIVED" && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Button
                buttonStyle={{
                  backgroundColor: color.danger,
                  borderRadius: 10,
                  gap: 5,
                }}
                onPress={deleteRelationship}
              >
                <Icon name="dangerous" color={color.white} />
                Từ chối
              </Button>
              <Button
                buttonStyle={{
                  backgroundColor: color.primary,
                  borderRadius: 10,
                  gap: 5,
                }}
                onPress={acceptFriendRequest}
              >
                <Icon name="check-circle" color={color.white} />
                Chấp nhận lời mời
              </Button>
            </View>
          )}
          {relationship === "REQUESTED" && (
            <Button
              buttonStyle={{
                backgroundColor: color.danger,
                borderRadius: 10,
                gap: 10,
              }}
              onPress={deleteRelationship}
            >
              <Icon name="dangerous" color={color.white} />
              Hủy lời mời
            </Button>
          )}

          <View style={{ position: "absolute", top: -50, right: -50 }}>
            <IconButtonComponent
              icon="close"
              onPress={hideRelationshipModal}
              iconColor={color.white}
            />
          </View>
        </View>
      </View>
    );
  };

  const getAccount = (id: string) => {
    return accountService
      .getAccount(id)
      .then((res) => {
        const account: Interfaces.IUser | null = res.data?.data;
        if (!account) return;
        setAccount(account);
        if (!account.relationship) return;
        const relationship =
          account.relationship.status == "FRIEND"
            ? "FRIEND"
            : account.relationship.createdBy == currentAccount?.id
            ? "REQUESTED"
            : "RECEIVED";
        setRelationship(relationship);
      })
      .catch(() => {
        CommonService.showToast("error", "Lỗi", "Mất kết nối tới máy chủ");
      });
  };

  useEffect(() => {
    getAccount(id as string).finally(() => {
      setLoading(false);
    });
    console.log(id as string);
  }, [id]);

  return (
    <View>
      {loading || !account ? (
        <ActivityIndicator style={{ marginTop: 30 }} />
      ) : (
        <View style={{ borderBottomWidth: 3, borderColor: color.darkGrey }}>
          <View style={{ position: "relative" }}>
            <Image
              source={
                account.coverImage
                  ? { uri: account.coverImage }
                  : require("@/assets/images/gray.png")
              }
              style={{ height: 200, width: "100%", objectFit: "cover" }}
            />
            <View style={{ position: "absolute", bottom: -50, left: 20 }}>
              <AvatarComponent
                imageUrl={account.profileImage}
                size={150}
                borderColor={color.grey}
                borderWidth={3}
              />
            </View>
          </View>
          <View
            style={{
              gap: 20,
              padding: 25,
              paddingTop: 55,
            }}
          >
            <View style={{}}>
              <Text style={{ fontSize: 25, fontWeight: 500 }}>
                {account.displayName}
              </Text>
              <Text style={{ color: color.darkGrey }}>1.2k người bạn</Text>
            </View>
            <View style={{}}>
              {currentAccount?.id == account.id ? (
                <Button
                  buttonStyle={{
                    width: "100%",
                    borderRadius: 10,
                    gap: 5,
                  }}
                >
                  <Icon name="edit" color={color.white} size={20} />
                  <Text style={{ color: color.white, fontWeight: 500 }}>
                    Chỉnh sửa thông tin cá nhân
                  </Text>
                </Button>
              ) : (
                <View
                  style={{
                    gap: 10,
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Modal transparent visible={relationshipModalVisible}>
                    <RelationshipModal />
                  </Modal>
                  <Button
                    buttonStyle={{
                      borderRadius: 10,
                      gap: 5,
                      backgroundColor: color.lightGrey,
                      minWidth: 100,
                    }}
                    onPress={showRelationshipModal}
                    disabled={relationshipLoading}
                  >
                    {relationshipLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <>
                        <Icon name={getRelationshipInfo().icon} />
                        <Text
                          style={{
                            color: color.black,
                            fontWeight: "bold",
                            fontSize: 13,
                          }}
                        >
                          {getRelationshipInfo().label}
                        </Text>
                      </>
                    )}
                  </Button>
                  <Button
                    buttonStyle={{
                      borderRadius: 10,
                      gap: 5,
                      backgroundColor: color.primary,
                    }}
                  >
                    <Icon name="mark-email-unread" color={color.white} />
                    <Text
                      style={{
                        color: color.white,
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      Nhắn tin
                    </Text>
                  </Button>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      <Toast />
    </View>
  );
};

export default AccountScreen;
