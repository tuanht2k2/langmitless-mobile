import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import AvatarComponent from "@/components/Avatar";
import Card from "@/components/Card";
import FullScreenLoadingComponent from "@/components/FullScreenActivityIndicator";
import ListSkeleton from "@/components/ListSkeleton";
import { Interfaces } from "@/data/interfaces/model";
import { RequestInterfaces } from "@/data/interfaces/request";
import accountService from "@/services/accountService";
import CommonService from "@/services/CommonService";
import { Icon } from "@rneui/themed";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

function LearnWithTeacherScreen() {
  const [teachers, setTeachers] = useState<Interfaces.IUser[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [teachersLoading, setTeachersLoading] = useState<boolean>(true);
  const router = useRouter();

  const [request, setRequest] =
    useState<RequestInterfaces.ISearchAccountRequest>({
      page: 0,
      pageSize: 10000,
      keyword: "",
      sortBy: "name",
      sortDir: "ASC",
      role: "TEACHER",
    });

  const showError = (error: any) => {
    CommonService.showToast("error", "Đã xảy ra lỗi!");
  };

  const getTeachers = async (
    request: RequestInterfaces.ISearchAccountRequest
  ) => {
    try {
      const res = await accountService.search(request, showError);
      if (res.data.length > 0) setTeachers(res.data);
      setTeachersLoading(false);
    } catch (error) {
      setTeachersLoading(false);
    }
  };

  useEffect(() => {
    setTeachersLoading(true);
    getTeachers(request);

    return () => {};
  }, [request]);

  const handleNavigate = (id: string) => {
    router.push(`/learn-with-teacher/${id}`);
  };

  return (
    <>
      {loading ? (
        <FullScreenLoadingComponent />
      ) : (
        <View style={{ minHeight: "100%", padding: 10 }}>
          <ScrollView style={{}}>
            <Card styles={{ gap: 10 }}>
              <Text style={{ fontWeight: "bold", color: color.textBlack2 }}>
                Danh sách giáo viên
              </Text>
              {teachersLoading ? (
                <ListSkeleton length={4} hasCircle />
              ) : (
                <View style={{}}>
                  {teachers.map((teacher, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (!teacher.id) return;
                        handleNavigate(teacher.id);
                      }}
                      style={{
                        backgroundColor: color.grey1,
                        padding: 5,
                        borderRadius: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <AvatarComponent imageUrl={teacher.profileImage} />
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{}}>{teacher.name}</Text>
                          <Icon
                            name="fiber-manual-record"
                            color={
                              teacher.status === "ONLINE"
                                ? color.success3
                                : color.warning3
                            }
                            size={15}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: color.pink1,
                          borderWidth: 1,
                          borderColor: color.pink2,
                          padding: 2,
                          borderRadius: 5,
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text
                          style={{ color: color.pink3, fontWeight: "bold" }}
                        >
                          {teacher.cost}/h
                        </Text>
                        <Icon name="attach-money" color={color.red3} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card>
          </ScrollView>
        </View>
      )}
    </>
  );
}

export default LearnWithTeacherScreen;
