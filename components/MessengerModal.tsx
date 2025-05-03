import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import color from "@/assets/styles/color";
import React, { Fragment, useEffect, useState } from "react";
import ModalComponent from "./Modal";
import Draggable from "react-native-draggable";
import IconButtonComponent from "./IconButton";

//@ts-ignore
import emptyImage from "@/assets/images/no_result.png";
//@ts-ignore
import messengerIcon from "@/assets/images/icons/messenger.png";
import { Controller, useForm } from "react-hook-form";
import { ResponseInterfaces } from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  hideMessenger,
  hideMessengerButton,
  openMessenger,
  overlayLoaded,
  overlayLoading,
  showMessenger,
} from "@/redux/reducers/globalSlide";
import messengerService from "@/services/messengerService";
import Messenger from "./Messenger";

const { height, width } = Dimensions.get("window");

function MessengerModal() {
  const visible = useSelector(
    (state: RootState) => state.global.messengerVisible
  );
  const buttonVisible = useSelector(
    (state: RootState) => state.global.messengerButtonVisible
  );
  const account = useSelector((state: RootState) => state.auth.account);
  const messengerId = useSelector(
    (state: RootState) => state.global.messengerId
  );

  const dispatch = useDispatch();

  const loading = () => {
    dispatch(overlayLoading());
  };

  const loaded = () => {
    dispatch(overlayLoaded());
  };

  const hideModal = () => {
    dispatch(hideMessenger());
  };
  const showModal = () => {
    dispatch(showMessenger());
  };
  const hideButton = () => {
    dispatch(hideMessengerButton());
  };

  const { control, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const [messengers, setMessengers] = useState<
    ResponseInterfaces.IMessengerResponse[]
  >([]);

  const handleSearchMessengers = async () => {
    loading();
    try {
      const res: ResponseInterfaces.ICommonResponse<
        ResponseInterfaces.IMessageResponse[]
      > = await messengerService.findMessengersByAccount();
      loaded();
      if (res.code != 200) {
        CommonService.showToast("error", "Đã xảy ra lỗi!");
        return;
      }
      setMessengers(res.data);
    } catch (error) {
      CommonService.showToast("error", "Đã xảy ra lỗi!");
      console.log("Error when handleSearchMessengers: ", error);
      loaded();
    }
  };

  const MessengerDetails = (
    messenger: ResponseInterfaces.IMessengerResponse
  ) => {
    const navigateToMessenger = () => {
      if (!messenger.id) return;
      dispatch(openMessenger(messenger.id));
    };
    return (
      <TouchableOpacity onPress={navigateToMessenger}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            src={messenger?.image}
            style={{ height: 50, width: 50, borderRadius: 100 }}
          />
          <Text style={{ color: color.grey5, fontWeight: "500", fontSize: 18 }}>
            {messenger?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (!account) return;
    handleSearchMessengers();
  }, [account]);

  return (
    <Fragment>
      {buttonVisible && (
        <Draggable
          x={width - 70}
          y={height - 300}
          renderSize={50}
          onShortPressRelease={showModal}
          children={
            <View style={{ position: "relative", width: 50, height: 50 }}>
              <Image
                source={messengerIcon}
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
        />
      )}
      <ModalComponent
        visible={visible}
        style={{ height: "100%", gap: 10 }}
        showHeader
        title="Trò chuyện"
        image={messengerIcon}
        onClose={hideModal}
      >
        {messengerId ? (
          <Messenger />
        ) : (
          <Fragment>
            <View style={{ height: 50 }}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      borderWidth: 1,
                      borderColor: color.purple1,
                      borderRadius: 10,
                      marginHorizontal: 10,
                    }}
                  >
                    <TextInput
                      placeholder="Tìm kiếm"
                      placeholderTextColor={color.textGrey3}
                      style={[
                        {
                          height: "100%",
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
                    />
                    <IconButtonComponent
                      icon="search"
                      iconColor={color.purple3}
                      onPress={handleSearchMessengers}
                    />
                  </View>
                )}
              />
            </View>
            <ScrollView style={{ padding: 10, gap: 10 }}>
              {messengers && messengers.length == 0 && !loading && (
                <Image height={100} width={100} source={emptyImage} />
              )}
              {messengers &&
                messengers.length > 0 &&
                messengers.map((messenger, index) => (
                  <MessengerDetails key={index} {...messenger} />
                ))}
            </ScrollView>
          </Fragment>
        )}
      </ModalComponent>
    </Fragment>
  );
}

export default MessengerModal;
