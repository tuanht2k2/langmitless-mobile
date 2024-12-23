import { Icon } from "@rneui/themed";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

const { height, width } = Dimensions.get("window");

function ChatbotComponent() {
  const [modalVisible, setModalVisible] = useState(false);

  const hideModal = () => {
    setModalVisible(false);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const { control, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = () => {};

  return (
    <Fragment>
      <Draggable
        x={width - 70}
        y={height - 80}
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
            gap: 10,
            backgroundColor: color.white2,
            flex: 1,
          }}
        >
          <View style={{ flex: 1, padding: 10 }}>
            <ScrollView></ScrollView>
          </View>
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
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    borderWidth: 1,
                    borderColor: color.grey2,
                    borderRadius: 7,
                  }}
                >
                  <TextInput
                    placeholder="Bạn cần hỗ trợ gì?"
                    placeholderTextColor={color.textGrey3}
                    style={[
                      {
                        // height: 50,
                        backgroundColor: "#fff",
                        paddingHorizontal: 15,
                        borderRadius: 8,
                        fontSize: 15,
                        flex: 1,
                      },
                    ]}
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
              icon="send"
              onPress={handleSubmit(onSubmit)}
              disabled={!watch("content").trim()}
              iconColor={color.textPrimary3}
            />
          </View>
        </View>
      </ModalComponent>
    </Fragment>
  );
}

export default ChatbotComponent;
