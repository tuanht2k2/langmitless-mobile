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
import { overlayLoaded, overlayLoading } from "@/redux/reducers/globalSlide";

function RoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const account = useSelector((state: RootState) => state.auth.account);
  const dispatch = useDispatch();

  const [teacherData, setTeacherData] = useState<Interfaces.IUser>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [totalTime, setTotalTime] = useState(1);

  const getTeacherData = async (id: string) => {
    try {
      const res = await accountService.getAccount(id);
      if (res.data) setTeacherData(res.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const teacherListener = (hire: ResponseInterfaces.IHireResponse) => {
    if (!hire.status || hire.createdBy?.id !== account?.id) return;
    dispatch(overlayLoaded());
    if (hire.status === "ACCEPTED") {
      router.replace(`/room/${hire.room?.id}`);
      return;
    }
    CommonService.showToast("info", "Giáo viên đã từ chối bạn!");
  };

  useSocket(`/topic/teachers/${id}`, teacherListener);

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
      await hireService.create(request, showError);
    } catch (error) {
      dispatch(overlayLoaded());
      showError("Giáo viên đang bận, vui lòng thử lại sau!");
    }
  };

  useEffect(() => {
    getTeacherData(id as string);

    return () => {};
  }, []);

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
          <ScrollView style={{}}>
            <Card styles={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <AvatarComponent imageUrl={teacherData.profileImage} size={100} />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: color.blue1,
                  }}
                >
                  {teacherData.name}
                </Text>
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
