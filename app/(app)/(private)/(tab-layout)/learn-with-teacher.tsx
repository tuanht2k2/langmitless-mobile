import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import AvatarComponent from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FullScreenLoadingComponent from "@/components/FullScreenActivityIndicator";
import ListSkeleton from "@/components/ListSkeleton";
import Tabs from "@/components/Tabs";
import { ComponentInterfaces } from "@/constants/component";
import { Interfaces } from "@/data/interfaces/model";
import { RequestInterfaces } from "@/data/interfaces/request";
import accountService from "@/services/accountService";
import CommonService from "@/services/CommonService";
import { Icon } from "@rneui/themed";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const TABS: ComponentInterfaces.ITab[] = [
  {
    title: "Tìm kiếm khóa học",
  },
  {
    title: "Câu hỏi thường gặp",
  },
  // {
  //   title: "Tìm kiếm giáo viên",
  // },
];

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

  const handleSearchCourses = () => {
    router.push("/courses");
  };

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      {loading ? (
        <FullScreenLoadingComponent />
      ) : (
        <View style={{ minHeight: "100%", padding: 10 }}>
          <ScrollView style={{}}>
            <Card styles={{ gap: 10 }}>
              <Text style={{ fontWeight: "bold", color: color.textMain }}>
                Học 1vs1 cùng giáo viên
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
                          <Text
                            style={{
                              color: color.blue1,
                              fontSize: 15,
                            }}
                          >
                            {teacher.name}
                          </Text>
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
                          backgroundColor: color.blue1,
                          borderWidth: 1,
                          borderColor: color.yellow1,
                          padding: 2,
                          borderRadius: 5,
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text
                          style={{ color: color.yellow1, fontWeight: "bold" }}
                        >
                          {teacher.cost}/h
                        </Text>
                        {/* <Icon name="attach-money" color={color.red3} /> */}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card>
            <Card styles={{ marginTop: 10 }}>
              <Text style={{ marginBottom: 20 }}>Học thông qua bài tập</Text>
              <Button title="Tìm khóa học" onClick={handleSearchCourses} />
              {/* <Tabs
                activeIndex={tabIndex}
                onChange={setTabIndex}
                tabs={TABS}
                styles={{ paddingHorizontal: 10 }}
              />
              <View>
                {tabIndex == 0 && <Button title=""/>}
              </View> */}
            </Card>
          </ScrollView>
        </View>
      )}
    </>
  );
}

export default LearnWithTeacherScreen;
