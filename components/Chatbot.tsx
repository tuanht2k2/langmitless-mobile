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
import React, { Fragment, useEffect, useRef, useState } from "react";
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
import { RequestInterfaces } from "@/data/interfaces/request";
import chatbotService from "@/services/chatbotService";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { set } from "firebase/database";
import CommonService from "@/services/CommonService";
import { useRouter } from "expo-router";
import { Divider, Icon } from "@rneui/themed";
import useSocket from "@/utils/useSocket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import getSocketClient from "@/utils/getSocketClient";
import Stomp from "stompjs";
import { getApiConfig, getWebsocketHeaders } from "@/services/axios";

const { height, width } = Dimensions.get("window");

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

function ChatbotComponent() {
  const router = useRouter();
  const account = useSelector((state: RootState) => state.auth.account);

  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => {
    setModalVisible(false);
  };
  const showModal = () => {
    setModalVisible(true);
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
      const res = await chatbotService.ask(data.content);
      // if (res && res.code) {

      // }
    } catch (error) {
      CommonService.showToast("error", "Có lỗi xảy ra");
      console.error(error);
    }
    setSending(false);
  };

  const handleChatbotResponse = (data: ResponseInterfaces.IChatbotResponse) => {
    setMessages((prev) => [...prev, data]);
  };

  useSocket(`/topic/chatbot/${account?.id}/messages`, handleChatbotResponse);

  const CourseDetails = (course: ResponseInterfaces.ICourseResponse) => {
    const navigateToCourse = (id: string) => {
      // router.push
    };

    return (
      <View>
        <Text style={{ fontWeight: "semibold", color: color.textPink3 }}>
          Tên khóa học:{" "}
          <Text style={{ fontWeight: "bold" }}>{course.name}</Text>
        </Text>
        <Text>
          Mô tả:{" "}
          <Text style={{ color: color.textGrey4 }}>{course.description}</Text>
        </Text>
        <Text>
          Giá tiền:{" "}
          <Text style={{ color: color.textYellow2 }}>{course.cost}</Text>
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text>Ngôn ngữ: </Text>
          <Image
            source={CommonService.getCourseLanguage(course.language)?.img}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text>{CommonService.getCourseLanguage(course.language)?.name}</Text>
        </View>
        <TouchableOpacity
          style={{
            padding: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            borderColor: color.pink3,
            borderWidth: 1,
            marginTop: 5,
            borderRadius: 5,
          }}
          onPress={() => {
            navigateToCourse(course.id as string);
          }}
        >
          <Text style={{ color: color.textPink3 }}>Xem chi tiết</Text>
          <Icon name="visibility" size={20} color={color.textPink3} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Fragment>
      <Draggable
        x={width - 70}
        y={height - 160}
        imageSource={chatbotIcon}
        renderSize={60}
        onShortPressRelease={showModal}
      />
      <ModalComponent
        visible={modalVisible}
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
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor:
                      message.type !== "ASK" ? color.primary3 : color.pink3,
                    gap: 5,
                  }}
                >
                  {message.message && (
                    <Text
                      style={{
                        color: color.textWhite1,
                        fontSize: 16,
                      }}
                    >
                      {message.message}
                    </Text>
                  )}
                  {message.courses && message.courses.length > 0 && (
                    <View style={{ gap: 5 }}>
                      {message.courses.map((item: any, index) => (
                        <View
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 5,
                            backgroundColor: color.white1,
                            borderRadius: 5,
                            marginVertical: 5,
                          }}
                        >
                          <CourseDetails {...item} />
                        </View>
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
