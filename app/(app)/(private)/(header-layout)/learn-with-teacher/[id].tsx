import color from "@/assets/styles/color";
import AvatarComponent from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FullScreenLoadingComponent from "@/components/FullScreenActivityIndicator";
import IconButtonComponent from "@/components/IconButton";
import { Interfaces } from "@/data/interfaces/model";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { RootState } from "@/redux/store";
import accountService from "@/services/accountService";
import CommonService from "@/services/CommonService";
import hireService from "@/services/hireService";
import useSocket from "@/utils/useSocket";
import { Icon } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

function RoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const account = useSelector((state: RootState) => state.auth.account);

  const [teacherData, setTeacherData] = useState<Interfaces.IUser>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [hiring, setHiring] = useState<boolean>(false);

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
    if (!hire.status) return;
    setHiring(false);
    if (hire.status === "ACCEPTED") {
      router.replace(`/room/${id}`);
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
      setHiring(true);
      const request: RequestInterfaces.IEditHireRequest = {
        teacherId,
        totalTime,
      };
      await hireService.create(request, showError);
    } catch (error) {
      setHiring(false);
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
                    color: color.pink3,
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
                iconColor={color.pink3}
              />
              <Text style={{ fontWeight: "bold", color: color.pink3 }}>
                {totalTime}h
              </Text>
              <IconButtonComponent
                icon="arrow-forward-ios"
                onPress={() => {
                  setTotalTime((prev) => prev + 1);
                }}
                disabled={totalTime === 5}
                size={15}
                iconColor={color.pink3}
              />
            </View>
            <Button
              title={`THUÊ - ${(teacherData.cost || 0) * totalTime} VND`}
              style={{ minWidth: 145 }}
              loading={hiring}
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
