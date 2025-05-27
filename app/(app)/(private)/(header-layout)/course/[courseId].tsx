import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CommonService from "@/services/CommonService";
import GlobalStyle from "@/assets/styles/globalStyles";
//@ts-ignore
import noResultFoundImg from "@/assets/images/no_result.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCourse } from "@/contexts";
import color from "@/assets/styles/color";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ModalComponent from "@/components/Modal";
import OtpComponent from "@/components/OtpComponent";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import courseService from "@/services/courseService";
import TopicListMember from "@/components/TopicListMember";
import { Interfaces } from "@/data/interfaces/model";
import { overlayLoaded, overlayLoading } from "@/redux/reducers/globalSlide";
import AvatarComponent from "@/components/Avatar";
import { Icon } from "@rneui/themed";

interface IColorElement {
  text: string;
  background: string;
}
interface IColor {
  light: IColorElement;
  dark: IColorElement;
}

const colors: IColor[] = [
  {
    light: {
      background: color.warning1,
      text: color.warning2,
    },
    dark: {
      background: color.warning2,
      text: color.warning1,
    },
  },
  {
    light: {
      background: color.secondary1,
      text: color.secondary2,
    },
    dark: {
      background: color.secondary2,
      text: color.secondary1,
    },
  },
  {
    light: {
      background: color.primary3,
      text: color.primary1,
    },
    dark: {
      background: color.primary4,
      text: color.primary2,
    },
  },
  {
    light: {
      background: color.success1,
      text: color.success2,
    },
    dark: {
      background: color.success2,
      text: color.success1,
    },
  },
  {
    light: {
      background: color.pink1,
      text: color.pink2,
    },
    dark: {
      background: color.pink2,
      text: color.pink1,
    },
  },
  {
    light: {
      background: color.red1,
      text: color.red2,
    },
    dark: {
      background: color.red2,
      text: color.red1,
    },
  },
  {
    light: {
      background: color.purple1,
      text: color.purple2,
    },
    dark: {
      background: color.purple2,
      text: color.purple1,
    },
  },
  {
    light: {
      background: color.yellow1,
      text: color.yellow2,
    },
    dark: {
      background: color.yellow2,
      text: color.yellow1,
    },
  },
  {
    light: {
      background: color.grey1,
      text: color.grey2,
    },
    dark: {
      background: color.grey2,
      text: color.grey1,
    },
  },
];

const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / 3 - 20;

function Course() {
  const dispatch = useDispatch();

  const { courseId } = useLocalSearchParams();
  const loading = useSelector((state: RootState) => state.global.isLoading);

  const account = useSelector((state: RootState) => state.auth.account);
  const { course, getCourseDetails, selectMember, selectedMember } =
    useCourse();

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

  const [memberVisible, setMemberVisible] = useState<boolean>(false);

  const [members, setMembers] = useState<Interfaces.IUser[]>([]);

  const handleGetMembers = async () => {
    if (!courseId) return;
    setMemberVisible(true);
    try {
      dispatch(overlayLoading());
      const res: ResponseInterfaces.ICommonResponse<Interfaces.IUser[]> =
        await courseService.getMembers(courseId as string);
      if (!res || res.code != 200) {
        CommonService.showError();
        return;
      }
      setMembers(res.data);
    } catch (error) {
      CommonService.showError();
    } finally {
      dispatch(overlayLoaded());
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
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
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
                {account?.id == course.createdBy?.id && (
                  <Button
                    title="Xem thành viên"
                    icon="groups"
                    textColor={color.primary3}
                    iconColor={color.primary3}
                    style={{ backgroundColor: color.primary1 }}
                    onClick={handleGetMembers}
                  />
                )}
              </View>
            </Card>
            <Card>
              <TopicListMember
                data={course.topics || []}
                editable={account?.id === course.createdBy?.id}
                canViewScoreHistory={
                  !!selectedMember || account?.id != course.createdBy?.id
                }
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
          style={{ margin: 10, backgroundColor: color.blue1 }}
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
          style={{ margin: 10, backgroundColor: color.blue1 }}
          textColor={color.accentGold}
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
      <ModalComponent
        title="Xem thành viên"
        onClose={() => {
          setMemberVisible(false);
        }}
        visible={memberVisible}
        showHeader
      >
        <View>
          <View style={{ padding: 5, paddingHorizontal: 20, gap: 5 }}>
            {!selectedMember && (
              <Text style={{ color: color.grey3, fontStyle: "italic" }}>
                Hãy chọn 1 học sinh để xem lịch sử làm bài
              </Text>
            )}
            {selectedMember && (
              <Text style={{ color: color.grey3, fontStyle: "italic" }}>
                Ấn vào từng chủ đề để xem lịch sử làm bài của học sinh
              </Text>
            )}
          </View>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              padding: 10,
            }}
          >
            {members.map((member, index) => {
              const localColor: IColor = colors[index % colors.length];

              const isActive = member.id === selectedMember;
              const textColor = isActive
                ? localColor.dark.text
                : localColor.light.text;
              const backgroundColor = isActive
                ? localColor.dark.background
                : localColor.light.background;

              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: itemSize,
                    aspectRatio: 1,
                    backgroundColor: backgroundColor,
                    borderRadius: 12,
                    margin: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                  onPress={() => {
                    selectMember(
                      selectedMember == member.id ? "" : member.id || ""
                    );
                  }}
                >
                  <AvatarComponent imageUrl={member.profileImage} />
                  <Text
                    style={{
                      marginTop: 6,
                      color: textColor,
                      fontSize: 14,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}. {member.name}
                  </Text>
                  {isActive && (
                    <View style={{ position: "absolute", top: -5, right: -5 }}>
                      <Icon name="check-circle" color={color.success3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ModalComponent>
    </View>
  );
}

export default Course;
