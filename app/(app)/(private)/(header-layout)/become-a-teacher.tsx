import color from "@/assets/styles/color";
import Button from "@/components/Button";
import { ImagePickerComponent } from "@/components/ImagePicker";
import { RequestInterfaces } from "@/data/interfaces/request";
import { loadAccount } from "@/redux/reducers/authSlice";
import { RootState } from "@/redux/store";
import accountService from "@/services/accountService";
import CommonService from "@/services/CommonService";
import fptAiService from "@/services/fptAiService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { StyleSheet, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const styles = StyleSheet.create({
  input: {
    padding: 10,
    backgroundColor: color.white1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.grey2,
  },
});

function BecomeATeacher() {
  const account = useSelector((state: RootState) => state.auth.account);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    setValue,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identification: "",
      gender: "",
      fullName: "",
      address: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  const validateInfo = async (uri: string) => {
    setLoading(true);
    const images = await CommonService.uriListToFiles([uri]);

    const request: any = images[0];

    fptAiService
      .identify(request)
      .then((res) => {
        CommonService.showToast(
          "success",
          "Thành công",
          "Xác thực căn cước công dân thành công!"
        );
        const data = res?.data?.data?.[0];
        if (!data) return;

        setValue("identification", data.id);
        setValue("address", data.address);
        setValue("fullName", data.name);
        setValue("gender", data.sex);
      })
      .catch(() => {
        CommonService.showToast(
          "error",
          "Thất bại",
          "Ảnh không hợp lệ, hãy chụp lại!"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const request: RequestInterfaces.IEditAccountRequest = {
        ...data,
        gender:
          data.gender === "NAM"
            ? "MALE"
            : data.gender === "NU"
            ? "FEMALE"
            : "OTHER",
        id: account?.id,
      };
      const res = await accountService.becomeATeacher(request);
      setLoading(false);
      if (!res) CommonService.showToast("error", "Đã xảy ra lỗi!");

      dispatch(loadAccount(res.data));

      CommonService.showToast(
        "success",
        "Đăng ký trở thành giáo viên thành công!"
      );
      router.push("/teacher");
    } catch (error) {
      setLoading(false);
      CommonService.showToast("error", "CCCD đã được sử dụng!");
    }
  };

  return (
    <View>
      <ImagePickerComponent
        header="Xác thực căn cước công dân"
        onSubmit={validateInfo}
      />
      <View style={{ gap: 10, padding: 10 }}>
        <Controller
          control={control}
          name="identification"
          rules={{
            required: "Số CCCD không được bỏ trống",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              editable={false}
              placeholder="Số CCCD"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.identification && { borderColor: "red", borderWidth: 1 },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="gender"
          rules={{
            required: "Giới tính không được bỏ trống",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              editable={false}
              placeholder="Giới tính"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.gender && { borderColor: "red", borderWidth: 1 },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="fullName"
          rules={{
            required: "Họ tên không được bỏ trống",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              editable={false}
              placeholder="Họ tên"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.fullName && { borderColor: "red", borderWidth: 1 },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          rules={{
            required: "Địa chỉ không được bỏ trống",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              editable={false}
              placeholder="Địa chỉ"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.address && { borderColor: "red", borderWidth: 1 },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Button
          title="Đăng ký"
          onClick={handleSubmit(onSubmit)}
          loading={loading}
        />
      </View>
      <Toast />
    </View>
  );
}

export default BecomeATeacher;
