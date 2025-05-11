import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
import Button from "@/components/Button";
import ModalComponent from "@/components/Modal";
import OtpComponent from "@/components/OtpComponent";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import courseService from "@/services/courseService";
import TopicListMember from "@/components/TopicListMember";

function Course() {
  const { courseId } = useLocalSearchParams();
  const loading = useSelector((state: RootState) => state.global.isLoading);
  const account = useSelector((state: RootState) => state.auth.account);
  const { course, getCourseDetails } = useCourse();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  useEffect(() => {
    getCourseDetails(courseId as string);
  }, []);

  const [buyModalVisible, setBuyModalVisible] = useState<boolean>(false);

  const handleBuyCourse = async () => {
    try {
      if (!courseId) return;

      const request: RequestInterfaces.IBuyCourseRequest = {
        courseId: courseId as string,
      };

      const res: ResponseInterfaces.ICommonResponse<null> =
        await courseService.buy(request);
      if (res.code != 200) {
        CommonService.showToast("error", "Đã xảy ra lỗi!");
        return;
      }
      setBuyModalVisible(false);
      getCourseDetails(courseId as string);
    } catch (error) {
      setBuyModalVisible(false);
      CommonService.showToast("error", "Đã xảy ra lỗi!");
    }
  };

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
                <Text style={{ color: color.textGrey4, fontSize: 13 }}>
                  Giá tiền:
                  <Text style={{ color: color.pink3, fontWeight: "bold" }}>
                    {` ${course.cost}`}
                  </Text>{" "}
                  VNĐ
                </Text>
              </View>
            </Card>
            <Card>
              <TopicListMember
                data={course.topics || []}
                editable={account?.id === course.createdBy?.id}
                onSelectTopic={(id) => {
                  setSelectedTopicId(id);
                }}
              />
            </Card>
          </View>
        </ScrollView>
      )}
      {course && !course.isMember && course.createdBy?.id != account?.id && (
        <Button
          title={`${course.cost} VNĐ`}
          style={{ margin: 10 }}
          onClick={() => {
            if ((account?.balance || 0) < (course.cost || 0)) {
              CommonService.showToast(
                "error",
                "Bạn không đủ tiền để mua khóa học này"
              );
            } else {
              setBuyModalVisible(true);
            }
          }}
        />
      )}
      {course && course.isMember && course.createdBy?.id != account?.id && (
        <Button
          title={"Bắt đầu"}
          style={{ margin: 10 }}
          onClick={() => {
            if (!selectedTopicId) {
              CommonService.showToast(
                "info",
                "Vui lòng chọn một chủ đề để bắt đầu"
              );
              return;
            }

            router.push({
              pathname: "/member/AnswerQuestion",
              params: { topicId: selectedTopicId },
            });
          }}
        />
      )}
      <ModalComponent
        title="Xác nhận OTP"
        onClose={() => {
          setBuyModalVisible(false);
        }}
        visible={buyModalVisible}
        style={{ height: "95%" }}
      >
        <OtpComponent
          otpVerified={!buyModalVisible}
          setOtpVerified={() => {
            handleBuyCourse();
          }}
        />
      </ModalComponent>
    </View>
  );
}

export default Course;
