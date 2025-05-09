import color from "@/assets/styles/color";
import AvatarComponent from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FullScreenLoadingComponent from "@/components/FullScreenActivityIndicator";
import IconButtonComponent from "@/components/IconButton";
import accountService from "@/services/accountService";
import CommonService from "@/services/CommonService";
import hireService from "@/services/hireService";
import useSocket from "@/utils/useSocket";
import { Interfaces } from "@/data/interfaces/model";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  openMessenger,
  overlayLoaded,
  overlayLoading,
} from "@/redux/reducers/globalSlide";
import { set } from "react-hook-form";
import Divider from "@/components/Divider";
import useResilientSocket from "@/utils/useResilientSocket";
import messengerService from "@/services/messengerService";

function RoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const account = useSelector((state: RootState) => state.auth.account);
  const dispatch = useDispatch();
  const [hireResponse, setHireResponse] = useState<boolean>(false);

  const [teacherData, setTeacherData] = useState<Interfaces.IUser>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [totalTime, setTotalTime] = useState(1);

  const getTeacherData = async (id: string) => {
    try {
      const request: RequestInterfaces.ISearchHireHistoryRequest = {
        accountId: id,
      };
      const res: ResponseInterfaces.ICommonResponse<Interfaces.IUser> =
        await accountService.searchHireHistory(request);
      setLoading(false);
      if (res && res.data) setTeacherData(res.data);
    } catch (error) {
      setLoading(false);
    }
  };

  const teacherListener = (hire: ResponseInterfaces.IHireResponse) => {
    if (
      !hire.status ||
      hire.status === "PENDING" ||
      hire.createdBy?.id !== account?.id
    )
      return;
    setHireResponse(true);
    dispatch(overlayLoaded());

    if (hire.status === "ACCEPTED") {
      router.replace(`/room/${hire.id}`);
      return;
    } else if (hire.status === "REJECTED") {
      CommonService.showToast("info", "Giáo viên đã từ chối bạn!");
    }
  };

  useResilientSocket(`/topic/teachers/${id}`, teacherListener);

  const showError = (error = "Đã xảy ra lỗi!") => {
    CommonService.showToast("error", error);
  };

  const hireTeacher = async (teacherId: string) => {
    try {
      dispatch(overlayLoading());
      const request: RequestInterfaces.IEditHireRequest = {
        teacherId,
        totalTime,
      };
      const res: ResponseInterfaces.ICommonResponse<Object> =
        await hireService.create(request, showError);
      if (res.code != 200) {
        dispatch(overlayLoaded());
        showError(res.message);
      }
    } catch (error) {
      dispatch(overlayLoaded());
      showError("Giáo viên đang bận, vui lòng thử lại sau!");
    }
  };

  useEffect(() => {
    getTeacherData(id as string);

    return () => {};
  }, []);

  const navigateMessenger = async () => {
    if (!teacherData) return;
    dispatch(overlayLoading());
    try {
      const res: ResponseInterfaces.ICommonResponse<ResponseInterfaces.IMessengerResponse> =
        await messengerService.findMessengerWithAnother(
          teacherData.id as string
        );
      dispatch(overlayLoaded());

      if (!res || !res.data || res.code !== 200) {
        showError();
      }
      dispatch(openMessenger(res.data.id as string));
    } catch (error) {
      console.error("An error occurred when navigateMessenger: ", error);
      showError();
      dispatch(overlayLoaded());
    }
  };

  return (
    <>
      {loading ? (
        <FullScreenLoadingComponent />
      ) : (
        <View
          style={{
            padding: 10,
            gap: 10,
            backgroundColor: color.grey1,
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <ScrollView>
            <Card
              styles={{
                flexDirection: "row",
                alignItems: "center",
                padding: 15,
                backgroundColor: color.white1,
                borderRadius: 12,
              }}
            >
              <AvatarComponent imageUrl={teacherData.profileImage} size={80} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: color.textMain,
                  }}
                >
                  {" "}
                  {teacherData.name}
                </Text>
                <Text
                  style={{ fontSize: 15, color: color.grey3, marginTop: 4 }}
                >
                  {" "}
                  {teacherData.cost} đ/h
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    color: color.warning4,
                    textDecorationLine: "underline",
                    marginBottom: 4,
                  }}
                >
                  Liên hệ
                </Text>
                <Text style={{ color: color.grey3, fontSize: 14 }}>
                  {teacherData.phoneNumber}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 6 }}>
                  <IconButtonComponent
                    icon="mail"
                    iconColor={color.warning4}
                    size={24}
                    onPress={navigateMessenger}
                  />
                  <IconButtonComponent
                    icon="call"
                    iconColor={color.success3}
                    size={24}
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </View>
            </Card>

            <Card styles={{ padding: 10, marginTop: 10 }}>
              <Text style={{ fontSize: 17 }}>Lịch sử được thuê</Text>
              <View style={{ gap: 10, marginTop: 10 }}>
                {teacherData.hireHistory &&
                  teacherData.hireHistory
                    .filter(
                      (hire: ResponseInterfaces.IHireResponse) =>
                        hire.actualTime
                    )
                    .map((hire: ResponseInterfaces.IHireResponse, index) => (
                      <View
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                          borderWidth: 1,
                          borderColor: color.grey1,
                          borderRadius: 10,
                          padding: 10,
                        }}
                      >
                        <Text style={{ width: 20 }}>{index + 1}</Text>
                        <AvatarComponent
                          imageUrl={hire.createdBy?.profileImage}
                        />
                        <Text style={{ fontWeight: "bold" }}>
                          {hire.createdBy?.name}
                        </Text>
                        <Text style={{ color: color.grey4 }}>
                          Đã thuê{" "}
                          {hire.actualTime
                            ? Math.floor((hire.actualTime * 100) / 3600) / 100
                            : 0}
                          h
                        </Text>
                      </View>
                    ))}
              </View>
            </Card>
          </ScrollView>
          <Card
            styles={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <IconButtonComponent
                icon="arrow-back-ios"
                onPress={() => {
                  setTotalTime((prev) => prev - 1);
                }}
                disabled={totalTime === 1}
                size={15}
                iconColor={color.blue1}
              />
              <Text style={{ fontWeight: "bold", color: color.blue1 }}>
                {totalTime}h
              </Text>
              <IconButtonComponent
                icon="arrow-forward-ios"
                onPress={() => {
                  setTotalTime((prev) => prev + 1);
                }}
                disabled={totalTime === 5}
                size={15}
                iconColor={color.blue1}
              />
            </View>
            <Button
              title={`THUÊ - ${(teacherData.cost || 0) * totalTime} VND`}
              textColor={color.yellow1}
              style={{ minWidth: 155, backgroundColor: color.blue1 }}
              onClick={() => {
                if (!teacherData.id) return;
                hireTeacher(teacherData.id);
              }}
            ></Button>
          </Card>
        </View>
      )}
    </>
  );
}

export default RoomScreen;
