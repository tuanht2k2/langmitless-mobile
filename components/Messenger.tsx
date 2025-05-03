import {
  closeMessenger,
  overlayLoaded,
  overlayLoading,
} from "@/redux/reducers/globalSlide";
import { RootState } from "@/redux/store";
import React, { Fragment, useEffect, useRef, useState } from "react";

import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import IconButtonComponent from "./IconButton";
import { ResponseInterfaces } from "@/data/interfaces/response";
import messageService from "@/services/messageService";
import CommonService from "@/services/CommonService";
import messengerService from "@/services/messengerService";
import color from "@/assets/styles/color";
import AvatarComponent from "./Avatar";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import HorizontalDivider from "./HorizontalDivider";
import { RequestInterfaces } from "@/data/interfaces/request";
import useSocket from "@/utils/useSocket";
import useResilientSocket from "@/utils/useResilientSocket";
import Card from "./Card";

const { width } = Dimensions.get("window");

function Messenger() {
  const id = useSelector((state: RootState) => state.global.messengerId);
  const account = useSelector((state: RootState) => state.auth.account);

  const dispatch = useDispatch();

  const close = () => {
    dispatch(closeMessenger());
  };

  const [messenger, setMessenger] =
    useState<ResponseInterfaces.IMessengerResponse | null>(null);

  const getMessengerDetails = async (id: string) => {
    if (!id) return;
    dispatch(overlayLoading());
    try {
      const res: ResponseInterfaces.ICommonResponse<ResponseInterfaces.IMessengerResponse> =
        await messengerService.details(id);
      dispatch(overlayLoaded());
      if (!res || res.code != 200) {
        CommonService.showError();
      }
      setMessenger(res.data);
    } catch (error) {
      dispatch(overlayLoaded());
      CommonService.showError();
    }
  };

  const isCurrentAccount = (id: string) => {
    return id === account?.id;
  };

  const Message = (message: ResponseInterfaces.IMessageResponse) => {
    const isCurrent = isCurrentAccount(message.createdBy?.id as string);

    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: isCurrent ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            maxWidth: "70%",
            display: "flex",
            flexDirection: isCurrent ? "row-reverse" : "row",
            gap: 3,
            padding: 5,
          }}
        >
          <AvatarComponent imageUrl={message.createdBy?.profileImage} />
          <View style={{ gap: 2 }}>
            {message.content && (
              <Text
                style={{
                  backgroundColor: isCurrent ? color.primary3 : color.pink2,
                  padding: 10,
                  borderRadius: 10,
                  color: color.white1,
                }}
              >
                {message.content}
              </Text>
            )}
            {message.fileUrl && (
              <Image
                src={message.fileUrl}
                style={{
                  height: width * 0.5,
                  width: width * 0.5,
                  borderRadius: 10,
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getMessengerDetails(id);
  }, [id]);

  // messages scroll
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (messenger?.messages) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messenger?.messages]);

  // send messages...
  const { control, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const [sending, setSending] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  // pick picture
  const MessageImagePicker = () => {
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Bạn cần cấp quyền cho langmitless truy cập thư viện");
        return false;
      }
      return true;
    };

    const pickImage = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setImage(uri);
      }
    };

    const takePhoto = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setImage(uri);
      }
    };

    const clearImage = () => {
      setImage(null);
    };

    return (
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 5,
            gap: 20,
          }}
        >
          <IconButtonComponent
            icon="add-a-photo"
            iconColor={color.primary3}
            style={{ padding: 0 }}
            onPress={takePhoto}
          />
          <IconButtonComponent
            icon="image"
            iconColor={color.primary3}
            style={{ padding: 0 }}
            onPress={pickImage}
          />
        </View>
        {image && (
          <View
            style={{
              paddingHorizontal: 10,
              position: "relative",
              height: 150,
              width: 150,
            }}
          >
            <Image
              source={{ uri: image }}
              style={{ height: "100%", width: "100%", borderRadius: 10 }}
            />
            <IconButtonComponent
              icon="close"
              style={{ position: "absolute", top: -5, right: 0, padding: 0 }}
              iconColor={color.pink3}
              color={color.white1}
              onPress={clearImage}
              size={25}
            />
          </View>
        )}
      </View>
    );
  };

  const onSubmit = async (data: any) => {
    if (!account?.id) return;
    setSending(true);

    try {
      let images = null;
      if (image) {
        images = await CommonService.uriListToFiles([image]);
      }
      const request: RequestInterfaces.IEditMessageRequest = {
        messengerId: id,
        content: data.content,
        files: images,
      };

      setValue("content", "");
      setImage(null);
      const res: ResponseInterfaces.ICommonResponse<null> =
        await messageService.create(request);

      setSending(false);
      if (!res || res.code != 200) {
        CommonService.showError();
        return;
      }
    } catch (error) {
      CommonService.showError();
      setSending(false);
      console.error(error);
    }
    setSending(false);
  };

  const newMessageListener = (data: ResponseInterfaces.IMessageResponse) => {
    setMessenger((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages:
          prev.messages && prev.messages.length > 0
            ? [...prev.messages, data]
            : [data],
      };
    });
  };

  useResilientSocket(`/topic/messengers/${id}/messages`, newMessageListener);

  return (
    <View style={{ flex: 1 }}>
      {messenger && (
        <Fragment>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomColor: color.grey2,
              borderBottomWidth: 1,
              borderTopColor: color.grey1,
              borderTopWidth: 1,
              paddingVertical: 5,
            }}
          >
            <IconButtonComponent
              icon="chevron-left"
              size={40}
              onPress={close}
              iconColor={color.grey3}
            />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AvatarComponent imageUrl={messenger.image} />
              <View>
                <Text style={{ fontSize: 17, fontWeight: "400" }}>
                  {messenger.name}
                </Text>
                <Text style={{ fontSize: 13, color: color.grey4 }}>
                  Đang hoạt động
                </Text>
              </View>
            </View>
          </View>

          {/* Scrollable messages */}
          <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
            {messenger.messages &&
              messenger.messages.map(
                (message: ResponseInterfaces.IMessageResponse, index) => (
                  <Message key={index} {...message} />
                )
              )}
          </ScrollView>

          {/* Input box at bottom */}
          {/* <HorizontalDivider /> */}
          <Card>
            <MessageImagePicker />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: color.white1,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: 5,
              }}
            >
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
                      paddingHorizontal: 10,
                    }}
                  >
                    <TextInput
                      placeholder="Nhập tin nhắn..."
                      placeholderTextColor={color.textGrey3}
                      style={{
                        flex: 1,
                        fontSize: 15,
                        paddingVertical: 5,
                      }}
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline
                    />
                  </View>
                )}
              />
              <IconButtonComponent
                icon={"send"}
                onPress={handleSubmit(onSubmit)}
                disabled={(!watch("content").trim() && !image) || sending}
                iconColor={color.textPrimary3}
              />
            </View>
          </Card>
        </Fragment>
      )}
    </View>
  );
}

export default Messenger;
