import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";

import color from "@/assets/styles/color";
import React, { Fragment, useState } from "react";
import ModalComponent from "./Modal";
import Draggable from "react-native-draggable";
import GlobalStyle from "@/assets/styles/globalStyles";
import IconButtonComponent from "./IconButton";

//@ts-ignore
import microIcon from "@/assets/images/icons/micro.png";
//@ts-ignore
import chatbotIcon from "@/assets/images/icons/chatbot.png";
import { Controller, useForm } from "react-hook-form";
import Tabs from "./Tabs";
import { ComponentInterfaces } from "@/constants/component";
import chatbotService from "@/services/chatbotService";
import { ResponseInterfaces } from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import { useRouter } from "expo-router";
import { Icon } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  askChatbotAboutCourse,
  clearCourse,
  hideChatbot,
  hideChatbotButton,
  showChatbot,
} from "@/redux/reducers/globalSlide";
import useResilientSocket from "@/utils/useResilientSocket";
import Card from "./Card";

const { height, width } = Dimensions.get("window");

const TABS: ComponentInterfaces.ITab[] = [
  {
    title: "Tìm kiếm khóa học",
  },
  {
    title: "Câu hỏi thường gặp",
  },
];

function ChatbotComponent() {
  const router = useRouter();
  const visible = useSelector(
    (state: RootState) => state.global.chatbotVisible
  );
  const buttonVisible = useSelector(
    (state: RootState) => state.global.chatbotButtonVisible
  );

  const account = useSelector((state: RootState) => state.auth.account);
  const course = useSelector((state: RootState) => state.global.course);

  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(hideChatbot());
  };
  const showModal = () => {
    dispatch(showChatbot());
  };
  const hideButton = () => {
    dispatch(hideChatbotButton());
  };

  const [tabIndex, setTabIndex] = useState(0);

  const { control, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const [messages, setMessages] = useState<
    ResponseInterfaces.IChatbotResponse[]
  >([]);

  const [sending, setSending] = useState(false);

  const onSubmit = async (data: any) => {
    setSending(true);

    try {
      if (!account?.id) return;
      setMessages((prev) => [...prev, { message: data.content, type: "ASK" }]);
      setValue("content", "");
      const res = course
        ? await chatbotService.askAbountCourse({
            courseId: course.id || "",
            message: data.content,
          })
        : await chatbotService.ask(data.content);
      if (res && res.code != 200) {
        CommonService.showToast("error", "Có lỗi xảy ra");
      }
    } catch (error) {
      CommonService.showToast("error", "Có lỗi xảy ra");
      console.error(error);
    }
    setSending(false);
  };

  const handleChatbotResponse = (data: ResponseInterfaces.IChatbotResponse) => {
    setMessages((prev) => [...prev, data]);
  };

  useResilientSocket(
    `/topic/chatbot/${account?.id}/messages`,
    handleChatbotResponse
  );

  const CourseDetails = (course: ResponseInterfaces.ICourseResponse) => {
    const navigateToCourse = (id: string) => {
      router.push(`/course/${id}`);
    };

    return (
      <Card>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: color.pink3,
            marginBottom: 6,
          }}
        >
          {course.name}
        </Text>

        <Text
          style={{ color: color.textGrey4, fontWeight: "600", marginBottom: 2 }}
        >
          Mô tả:
        </Text>
        <Text style={{ color: color.textBlack1, marginBottom: 8 }}>
          {course.description}
        </Text>

        <Text
          style={{ color: color.textGrey4, fontWeight: "600", marginBottom: 2 }}
        >
          Giá tiền:
        </Text>
        <Text
          style={{
            color: color.yellow3,
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          {course.cost}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: color.textGrey4,
              fontWeight: "600",
              marginRight: 5,
            }}
          >
            Ngôn ngữ:
          </Text>
          <Image
            source={CommonService.getCourseLanguage(course.language)?.img}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text style={{ color: color.textBlack1 }}>
            {CommonService.getCourseLanguage(course.language)?.name}
          </Text>
        </View>

        <View
          style={{
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              backgroundColor: color.primary1,
              borderRadius: 6,
              gap: 5,
            }}
            onPress={() => {
              hideModal();
              navigateToCourse(course.id as string);
            }}
          >
            <Icon name="visibility" size={18} color={color.primary4} />
            <Text style={{ color: color.primary4, fontWeight: "bold" }}>
              Xem chi tiết
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              backgroundColor: color.pink1,
              borderRadius: 6,
              gap: 5,
            }}
            onPress={() => {
              dispatch(askChatbotAboutCourse(course));
            }}
          >
            <Icon name="support-agent" size={18} color={color.pink3} />
            <Text style={{ color: color.pink3, fontWeight: "bold" }}>
              Tìm hiểu thêm
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <Fragment>
      {buttonVisible && (
        <Draggable
          x={width - 70}
          y={height - 160}
          children={
            <View style={{ position: "relative", width: 50, height: 50 }}>
              <Image
                source={chatbotIcon}
                style={{ width: "100%", height: "100%" }}
              />
              <IconButtonComponent
                icon="close"
                style={{ position: "absolute", top: -5, right: -5, padding: 0 }}
                iconColor={color.pink3}
                color={color.white1}
                size={20}
                onPress={hideButton}
              />
            </View>
          }
          renderSize={60}
          onShortPressRelease={showModal}
        />
      )}
      <ModalComponent
        visible={visible}
        style={{ height: "100%" }}
        showHeader
        title="Trợ lý ảo"
        image={chatbotIcon}
        onClose={hideModal}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <View>
            <Tabs
              activeIndex={tabIndex}
              onChange={setTabIndex}
              tabs={TABS}
              styles={{ paddingHorizontal: 10 }}
            />
            {course && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 16, color: color.grey4 }}>
                  Bạn đang tìm hiểu về:{" "}
                  <Text style={{ fontWeight: "500", color: color.pink3 }}>
                    {course.name}
                  </Text>
                </Text>
                <IconButtonComponent
                  icon="close"
                  onPress={() => {
                    dispatch(clearCourse());
                  }}
                />
              </View>
            )}
          </View>

          <ScrollView
            style={{
              flex: 1,
              backgroundColor: color.grey1,
              margin: 10,
              borderRadius: 10,
            }}
            contentContainerStyle={{ padding: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <View
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent:
                    message.type !== "ASK" ? "flex-start" : "flex-end",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    maxWidth: "70%",
                  }}
                >
                  {message.message && (
                    <Text
                      style={{
                        color: color.textWhite1,
                        fontSize: 16,
                        backgroundColor:
                          message.type !== "ASK" ? color.primary3 : color.pink3,
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      {message.message}
                    </Text>
                  )}
                  {message.courses && message.courses.length > 0 && (
                    <View style={{ gap: 5 }}>
                      {message.courses.map((item: any, index) => (
                        // <View
                        //   key={index}
                        //   style={{
                        //     display: "flex",
                        //     flexDirection: "row",
                        //     alignItems: "center",
                        //     padding: 5,
                        //     backgroundColor: color.white1,
                        //     borderRadius: 10,
                        //     marginVertical: 5,
                        //     // borderWidth: 1,
                        //     // borderColor: color.primary3,
                        //   }}
                        // >
                        //   <CourseDetails {...item} />
                        // </View>
                        <CourseDetails key={index} {...item} />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              ...GlobalStyle.horizontalFlex,
              backgroundColor: color.white1,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingVertical: 5,
              paddingBottom: 10,
            }}
          >
            <IconButtonComponent image={microIcon} />
            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: color.grey2,
                    borderRadius: 7,
                  }}
                >
                  <TextInput
                    placeholder="Bạn cần hỗ trợ gì?"
                    placeholderTextColor={color.textGrey3}
                    style={{
                      backgroundColor: "#fff",
                      paddingHorizontal: 15,
                      borderRadius: 8,
                      fontSize: 15,
                      flex: 1,
                    }}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              )}
            />
            <IconButtonComponent
              icon={"send"}
              onPress={handleSubmit(onSubmit)}
              disabled={!watch("content").trim() || sending}
              iconColor={color.textPrimary3}
            />
          </View>
        </View>
      </ModalComponent>
    </Fragment>
  );
}

export default ChatbotComponent;
