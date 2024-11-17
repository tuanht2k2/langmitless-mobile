import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import AvatarComponent from "./Avatar";
import { Interfaces } from "@/data/interfaces/model";
import { Link, useRouter } from "expo-router";
import color from "@/assets/styles/color";
import { useDispatch } from "react-redux";
import { closeModal } from "@/redux/reducers/globalSlide";
import { Icon } from "@rneui/themed";
import IconButtonComponent from "./IconButton";
import commentReportService from "@/services/commentReportService";
import CommonService from "@/services/CommonService";

function CommentComponent(props: Interfaces.IComment) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const handleNavigateAccount = (id: string) => {
    if (!id) return;
    router.push(`/account/${id}`);
    dispatch(closeModal());
  };

  const handleReportComment = () => {
    setReportLoading(true);

    const request = {
      commentId: props.id,
      reason: "",
    };

    commentReportService
      .create(request)
      .then(() => {
        CommonService.showToast("info", "Báo cáo bình luận thành công!");
      })
      .catch(() => {
        CommonService.showToast("error", "Đã xảy ra lỗi!");
      })
      .finally(() => {
        setReportLoading(false);
        setModalVisible(false);
      });
  };

  return (
    <>
      <TouchableOpacity
        style={{ display: "flex", flexDirection: "row", gap: 10 }}
        onLongPress={() => {
          setModalVisible(true);
        }}
      >
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
      </TouchableOpacity>
      <Modal transparent={true} visible={modalVisible}>
        <View
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: color.extraLightOverlay,
          }}
        >
          <View
            style={{
              padding: 10,
              backgroundColor: color.white,
              borderRadius: 10,
              position: "relative",
            }}
          >
            <View style={{ position: "absolute", right: -35, top: -35 }}>
              <IconButtonComponent
                icon="clear"
                onPress={() => {
                  setModalVisible(false);
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: 3,
                minWidth: 145,
              }}
              disabled={reportLoading}
              onPress={handleReportComment}
            >
              {reportLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Icon name="report" />
                  <Text>Báo cáo bình luận</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default CommentComponent;
