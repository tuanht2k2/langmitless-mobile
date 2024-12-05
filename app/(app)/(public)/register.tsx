import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";

import { Controller, useForm } from "react-hook-form";
import { Interfaces } from "@/data/interfaces/model";
import { Link } from "expo-router";
import { Button, Icon } from "@rneui/themed";

import loginBackground from "@/assets/images/login_bgr.png";
import styles from "./style";
import GlobalStyle from "@/assets/styles/globalStyles";
import { ImagePickerComponent } from "@/components/ImagePicker";
import Toast from "react-native-toast-message";
import authService from "@/services/authService";
import CommonService from "@/services/CommonService";
import { RequestInterfaces } from "@/data/interfaces/request";
import fptAiService from "@/services/fptAiService";
import { Modal } from "react-native";
import color from "@/assets/styles/color";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0);

  const backStep = () => {
    if (step <= 0) return;
    setStep((prev) => prev - 1);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const checkValidRegisterInfo = (onSuccess: () => void) => {
    setLoading(true);

    const request: RequestInterfaces.IRegisterRequest = {
      email: getValues("email"),
      phoneNumber: getValues("phoneNumber"),
    };
    return authService
      .checkValidRegisterInfo(request)
      .then((res) => {
        onSuccess();
      })
      .catch((error) => {
        CommonService.showToast(
          "error",
          "Lỗi",
          "Email hoặc Số điện thoại đã được sử dụng!"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const basicView = () => {
    const submitBasicView = () => {
      checkValidRegisterInfo(nextStep);
    };

    return (
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: "Số điện thoại không được bỏ trống",
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: "Số điện thoại không hợp lệ, phải có 10-11 chữ số",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Số điện thoại"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.phoneNumber && { borderColor: "red", borderWidth: 1 },
              ]}
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email không được bỏ trống",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không hợp lệ",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.email && { borderColor: "red", borderWidth: 1 },
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          rules={{ required: "Họ tên không được bỏ trống" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Họ tên"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.name && { borderColor: "red", borderWidth: 1 },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <View style={{ ...styles.errorTextWrapper, bottom: -40 }}>
          {(errors.phoneNumber?.message ||
            errors.email?.message ||
            errors.name?.message) && (
            <Text style={styles.errorText}>
              {errors.phoneNumber?.message?.toString() ||
                errors.email?.message?.toString() ||
                errors.name?.message?.toString()}
            </Text>
          )}
        </View>

        <Button
          buttonStyle={GlobalStyle.mdBorderRadius}
          onPress={handleSubmit(submitBasicView)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            "Tiếp tục"
          )}
        </Button>
      </View>
    );
  };

  useEffect(() => {
    if (errors.password?.message) {
      CommonService.showToast("error", errors.password?.message?.toString());
      return;
    }
    if (errors.confirmPassword?.message) {
      CommonService.showToast(
        "error",
        errors.confirmPassword?.message?.toString()
      );
      return;
    }
  }, [errors.password?.message, errors.confirmPassword?.message]);

  const securityView = () => {
    const [securityViewLoading, setSecurityViewLoading] = useState(false);

    const submitSecurityView = (data: RequestInterfaces.IRegisterRequest) => {
      const request: RequestInterfaces.IRegisterRequest = {
        ...data,
      };

      setSecurityViewLoading(true);
      authService
        .register(request)
        .then(() => {
          CommonService.showToast(
            "success",
            "Đăng ký thành công",
            "Bạn có thể quay lại trang đăng nhập"
          );
        })
        .catch(() => {
          CommonService.showToast(
            "error",
            "Lỗi",
            "Số điện thoại hoặc Email đã được sử dụng"
          );
        })
        .finally(() => {
          setSecurityViewLoading(false);
        });
    };

    return (
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Mật khẩu không được bỏ trống",
            minLength: {
              value: 6,
              message: "Mật khẩu phải dài ít nhất 6 ký tự",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Mật khẩu"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.password && { borderColor: "red", borderWidth: 1 },
              ]}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Vui lòng nhập lại mật khẩu",
            validate: (value) =>
              value === watch("password") || "Mật khẩu không khớp",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.confirmPassword && {
                  borderColor: "red",
                  borderWidth: 1,
                },
              ]}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <View style={GlobalStyle.horizontalButtonGroup}>
          <Button
            buttonStyle={{
              ...GlobalStyle.xsBorderRadius,
              borderColor: "white",
            }}
            onPress={backStep}
            type="outline"
          >
            <Text style={{ color: "white" }}>Quay lại</Text>
          </Button>
          <Button
            title={!securityViewLoading ? "Xác nhận" : <ActivityIndicator />}
            disabled={securityViewLoading}
            buttonStyle={{ ...GlobalStyle.xsBorderRadius, minWidth: 90 }}
            onPress={handleSubmit(submitSecurityView)}
          />
        </View>
      </View>
    );
  };

  const views = [basicView, securityView];
  // const views = [authenticationView, confirmView];
  const CurrentView = views[step];

  return (
    <LinearGradient
      colors={[color.primary4, color.pink1]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.logoWrapper}>
        <Image
          source={require("@/assets/images/logo_remove_bgr.png")}
          style={styles.logo}
        />
        <Text style={styles.logoTitle}>langmitless</Text>
      </View>

      <CurrentView />

      {step === 0 && (
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <Link href={"/login"}>
            <Text style={styles.linkText}>Đã có tài khoản?</Text>
          </Link>
        </View>
      )}

      <Toast />
    </LinearGradient>
  );
}
