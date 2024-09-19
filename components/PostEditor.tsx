import color from "@/assets/styles/color";
import { Button, Dialog, Icon } from "@rneui/themed";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { ComponentIntefaces } from "@/constants/component";
import CommonService from "@/services/CommonService";
import postService from "@/services/postService";
import { RequestInterfaces } from "@/data/interfaces/request";
import Toast from "react-native-toast-message";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AvatarComponent from "./Avatar";
import { useRouter } from "expo-router";

export default function PostEditorComponent() {
  const account = useSelector((state: RootState) => state.auth.account);
  const router = useRouter();

  const width = Dimensions.get("window").width;
  const [loading, setLoading] = useState(false);

  const AUDIENCES: ComponentIntefaces.IDropdownOption<string>[] = [
    { name: "Công khai", code: "PUBLIC", icon: "public" },
    { name: "Chỉ mình tôi", code: "PRIVATE", icon: "lock" },
    { name: "Bạn bè", code: "FRIENDS", icon: "group" },
  ];
  const [isAudienceVisible, setIsAudienceVisible] = useState(false);
  const toggleAudience = () => {
    setIsAudienceVisible((prev) => !prev);
  };

  const { control, handleSubmit, getValues, watch } = useForm({
    defaultValues: {
      content: "",
      audience: "PUBLIC",
      type: "NORMAL",
    },
  });

  const content = watch("content");
  const audience = watch("audience");

  const [images, setImages] = useState<string[]>([]);

  const onSubmit = async () => {
    setLoading(true);

    let files = await CommonService.uriListToFiles(images);
    const request: RequestInterfaces.IEditPostRequest = {
      ...getValues(),
      files: files.length > 0 ? files : undefined,
    };

    postService
      .create(request)
      .then(() => {
        showToast("success", "Thành công", "Đăng bài viết thành công!");
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
        showToast("error", "Thất bại", "Đã xảy ra lỗi!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Bạn cần cấp quyền để truy cập thư viện ảnh");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedUris]);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedUris]);
    }
  };

  const handleRemoveImage = (removedIndex: number) => {
    setImages((prev) => prev.filter((_, index) => index != removedIndex));
  };

  const [dialog, setDialog] = useState<ComponentIntefaces.IActionDialog>({
    isVisible: false,
    title: "",
    content: "",
    onCancel: () => {},
    onConfirm: () => {},
  });

  const changeDialog = (dialog: ComponentIntefaces.IActionDialog) => {
    setDialog((prev) => ({ ...prev, ...dialog }));
  };

  // toast
  const showToast = (
    type: "success" | "error" | "info",
    text1: string = "",
    text2: string = ""
  ) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
    });
  };

  return (
    <View style={styles.wrapper}>
      <Dialog
        isVisible={dialog.isVisible}
        onBackdropPress={() => {
          changeDialog({ isVisible: false });
        }}
      >
        <Dialog.Title title={dialog.title} />
        <Text>{dialog.content}</Text>

        <Dialog.Actions>
          <Dialog.Button
            title="Xác nhận"
            onPress={() => {
              changeDialog({ isVisible: false });
              dialog.onConfirm?.();
            }}
          />
          <Dialog.Button
            title="Hủy"
            color="error"
            onPress={() => {
              changeDialog({ isVisible: false });
            }}
          />
        </Dialog.Actions>
      </Dialog>

      <View style={styles.header}>
        <AvatarComponent
          accountUrl={account?.id}
          imageUrl={account?.profileImage}
          size={50}
        />
        <View style={styles.headerRight}>
          <Text style={{ fontWeight: "500" }}>{account?.displayName}</Text>
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
            }}
            onPress={toggleAudience}
          >
            <Text style={{ color: color.darkGrey }}>
              {AUDIENCES.find((item) => item.code == audience)?.name}
            </Text>
            <Icon
              size={15}
              name={AUDIENCES.find((item) => item.code == audience)?.icon || ""}
              color={color.darkGrey}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Nội dung bài viết"
              placeholderTextColor="#666"
              style={[styles.contentInput]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline={true}
            />
          )}
        />
        <Dialog isVisible={isAudienceVisible} onBackdropPress={toggleAudience}>
          <Dialog.Title title="Chọn đối tượng chia sẻ" />
          <Controller
            control={control}
            name="audience"
            render={({ field: { onChange, onBlur, value } }) => {
              const selectedItem = AUDIENCES.find(
                (item) => item.code === value
              );

              return (
                <Dropdown
                  style={{ marginTop: 15 }}
                  data={AUDIENCES}
                  labelField="name"
                  valueField="code"
                  placeholder="Chọn đối tượng"
                  renderItem={(item) => {
                    return (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                          padding: 10,
                        }}
                      >
                        {item.icon && <Icon name={item.icon} color="#42557d" />}
                        <Text>{item.name}</Text>
                      </View>
                    );
                  }}
                  renderLeftIcon={() =>
                    selectedItem && selectedItem.icon ? (
                      <Icon
                        name={selectedItem.icon}
                        color="#42557d"
                        style={{ marginRight: 10 }}
                      />
                    ) : null
                  }
                  value={value}
                  onChange={(item) => {
                    onChange(item.code);
                    toggleAudience();
                  }}
                  onBlur={onBlur}
                />
              );
            }}
          />
        </Dialog>
      </View>

      {images.length > 0 && (
        <View style={styles.imagesWrapper}>
          <Carousel
            loop
            autoPlay={true}
            autoPlayInterval={3000}
            width={width}
            height={width / 1.5}
            data={images}
            scrollAnimationDuration={500}
            renderItem={(data) => (
              <View style={styles.imageWrapper}>
                <View style={styles.imageHeader}>
                  <Text style={styles.imageHeaderTitle}>{`${data.index + 1}/${
                    images.length
                  }`}</Text>
                  <TouchableOpacity
                    style={styles.imageRemoveButton}
                    onPress={() => {
                      handleRemoveImage(data.index);
                    }}
                  >
                    <Icon
                      style={styles.imageRemoveIcon}
                      name="close"
                      color={"white"}
                    />
                  </TouchableOpacity>
                </View>

                <Image
                  style={{
                    width: width,
                    height: width / 1.5,
                    objectFit: "contain",
                  }}
                  source={{ uri: data.item }}
                />
              </View>
            )}
          />
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Icon
            name="image"
            color={color.secondary}
            size={30}
            onPress={pickImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={takePhoto}>
          <Icon name="add-a-photo" color={color.primary} size={30} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={toggleAudience}>
          <Icon name="manage-accounts" color={color.danger} size={30} />
        </TouchableOpacity>
        <Button
          disabled={(images.length == 0 && !content?.trim()) || loading}
          buttonStyle={styles.submitButton}
          onPress={() => {
            changeDialog({
              isVisible: true,
              title: "Xác nhận đăng?",
              onConfirm: () => {
                handleSubmit(onSubmit)();
              },
            });
          }}
        >
          {loading ? <ActivityIndicator /> : "Đăng"}
        </Button>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  headerRight: {
    gap: 6,
  },
  contentWrapper: {},
  container: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
  },
  contentInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
  },
  imagesWrapper: {
    flex: 1,
  },
  imageWrapper: {
    width: "100%",
    backgroundColor: color.black,
  },
  imageHeader: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    gap: 20,
  },
  imageHeaderTitle: {
    color: color.white,
  },
  imageRemoveButton: {
    height: 30,
    width: 30,
    borderRadius: 10,
    backgroundColor: color.danger,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageRemoveIcon: {},
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: color.lightGrey,
    backgroundColor: color.white,
  },
  footerButton: {
    flex: 1,
    borderRadius: 20,
  },
  submitButton: {
    borderRadius: 5,
    minWidth: 80,
  },
});
