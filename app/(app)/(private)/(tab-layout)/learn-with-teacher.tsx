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

  return (
    <>
      {loading ? (
        <FullScreenLoadingComponent />
      ) : (
        <View style={{ flex: 1, padding: 12, backgroundColor: "#f5f7fa" }}>
          <ScrollView>
            <Card
              styles={{
                gap: 12,
                padding: 16,
                borderRadius: 16,
                backgroundColor: "#fff",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#342c75",
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                Học 1vs1 cùng giáo viên
              </Text>
              {teachersLoading ? (
                <ListSkeleton length={4} hasCircle />
              ) : (
                <View>
                  {teachers.map((teacher, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (!teacher.id) return;
                        handleNavigate(teacher.id);
                      }}
                      style={{
                        backgroundColor: "#e6f0ff", // nền xanh nhẹ
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 5,
                        elevation: 2,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 14,
                          alignItems: "center",
                        }}
                      >
                        <AvatarComponent
                          imageUrl={teacher.profileImage}
                          size={48}
                        />
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: "#244f71",
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {teacher.name}
                          </Text>
                          <Icon
                            name="fiber-manual-record"
                            color={
                              teacher.status === "ONLINE"
                                ? "#27ae60" // success3
                                : "#f39c12" // warning3
                            }
                            size={16}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#244f71",
                          borderWidth: 1,
                          borderColor: "#FAF8BF",
                          paddingVertical: 4,
                          paddingHorizontal: 14,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FAF8BF",
                            fontWeight: "bold",
                            fontSize: 14,
                          }}
                        >
                          {teacher.cost}/h
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card>

            <Card
              styles={{
                marginTop: 16,
                padding: 16,
                borderRadius: 16,
                backgroundColor: "#fff",
              }}
            >
              <Text
                style={{ marginBottom: 24, color: "#7f7f7f", fontSize: 16 }}
              >
                Học thông qua bài tập
              </Text>
              <Button
                title="Tìm khóa học"
                onClick={handleSearchCourses}
                style={{
                  borderRadius: 12,
                  backgroundColor: color.primary3,
                  paddingVertical: 12,
                }}
                textColor={color.white1}
                fontSize={16}
                icon="search"
                iconColor={color.white1}
              />
            </Card>
          </ScrollView>
        </View>
      )}
    </>
  );
}

export default LearnWithTeacherScreen;
