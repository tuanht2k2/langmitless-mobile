import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import CommonService from "@/services/CommonService";
import GlobalStyle from "@/assets/styles/globalStyles";
//@ts-ignore
import noResultFoundImg from "@/assets/images/no_result.png";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCourse } from "@/contexts";
import color from "@/assets/styles/color";
import Card from "@/components/Card";
import TopicList from "@/components/TopicList";

function Course() {
  const { courseId } = useLocalSearchParams();
  const loading = useSelector((state: RootState) => state.global.isLoading);
  const account = useSelector((state: RootState) => state.auth.account);

  const { course, getCourseDetails } = useCourse();

  useEffect(() => {
    getCourseDetails(courseId as string);
  }, []);

  return (
    <View style={GlobalStyle.background}>
      {!loading && !course && (
        <View style={{ ...GlobalStyle.center, width: "100%", height: "100%" }}>
          <Image
            source={noResultFoundImg}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
      {course && (
        <ScrollView>
          <View style={{ padding: 10, gap: 10 }}>
            <Card styles={{ gap: 10 }}>
              <View
                style={{
                  ...GlobalStyle.horizontalFlex,
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderColor: color.pink2,
                  paddingBottom: 10,
                }}
              >
                <Text style={{ fontWeight: "500", color: color.textPink3 }}>
                  {course.name}
                </Text>
                <View style={{ ...GlobalStyle.horizontalFlex, gap: 10 }}>
                  <Image
                    source={
                      CommonService.getCourseLanguage(course.language)?.img
                    }
                    style={{ height: 30, width: 30, borderRadius: 10 }}
                  />
                  <Text>
                    {CommonService.getCourseLanguage(course.language)?.name}
                  </Text>
                </View>
              </View>
              <Text style={{ color: color.textMain, fontStyle: "italic" }}>
                {course.description}
              </Text>
              <View>
                <Text style={{ color: color.textGrey4, fontSize: 13 }}>
                  Tạo bởi:
                  <Text
                    style={{ color: color.pink3, fontWeight: "bold" }}
                  >{` ${course.createdBy?.name},`}</Text>
                </Text>
                <Text style={{ color: color.textGrey4, fontSize: 13 }}>
                  {CommonService.getFormattedISO(course.createdAt)}
                </Text>
              </View>
            </Card>
            <Card>
              <TopicList
                data={course.topics || []}
                editable={account?.id === course.createdBy?.id}
              />
            </Card>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default Course;
