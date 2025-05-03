import color from "@/assets/styles/color";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { OtpInput } from "react-native-otp-entry";

//@ts-ignore
import otpImg from "@/assets/images/otp_bgr.png";
import otpService from "@/services/otpService";
import CommonService from "@/services/CommonService";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { useRouter } from "expo-router";
import { Modal } from "react-native";
import { useDispatch } from "react-redux";
import ModalComponent from "@/components/Modal";
import Toast from "react-native-toast-message";
import { RequestInterfaces } from "@/data/interfaces/request";

interface IProps {
  otpVerified?: boolean;
  setOtpVerified: (visible: boolean) => void;
}

function OtpComponent(props: IProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [getOtpLoading, setGetOtpLoading] = useState(false);

  const [verifyResponse, setVerifyResponse] =
    useState<ResponseInterfaces.IOtpResponse>({});

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const request: RequestInterfaces.IOtpRequest = {
        otp,
      };
      const res = await otpService.verify(request);
      const data: ResponseInterfaces.IOtpResponse = res.data;
      if (!data) {
        CommonService.showToast("error", "Đã xảy ra lỗi, vui lòng thử lại");
        setLoading(false);
        return;
      }
      setVerifyResponse(data);
      if (data.correct) {
        props.setOtpVerified(true);
      }
      // handleVerifyResponse(data);
    } catch (error) {
      CommonService.showToast("error", "Mã OTP không chính xác");
      setLoading(false);
    }
    setLoading(false);
  };

  const getOtp = async () => {
    try {
      const res = await otpService.get();

      const data = res?.data;
      if (!data) {
        CommonService.showToast(
          "error",
          "Bạn đã gửi OTP quá 5 lần",
          "Vui lòng thử lại sau 1 tiếng"
        );
        return;
      }

      setVerifyResponse((prev) => {
        const ver = {
          ...prev,
          remainResent: data.remainResent,
        };

        return ver;
      });
      CommonService.showToast(
        "info",
        "Gửi OTP thành công",
        "Hãy kiểm tra email mà bạn đã đăng ký"
      );
    } catch (error) {
      CommonService.showToast(
        "error",
        "Bạn đã gửi OTP quá 5 lần",
        "Vui lòng thử lại sau 1 tiếng"
      );
    }
    setGetOtpLoading(false);
  };

  const handleVerifyResponse = async (ver: ResponseInterfaces.IOtpResponse) => {
    if (!ver) return;
    if (!ver.remainSent && !ver.retryTime) {
      setNotiTitle("Bạn đã gửi lại OTP 5 lần, vui lòng thử lại sau 1 tiếng");
      return;
    }
    if (!ver.correct) {
      CommonService.showToast("error", "Mã OTP không chính xác");
      return;
    }
  };

  // max retried
  const [notiTitle, setNotiTitle] = useState("");

  return (
    <>
      <Modal transparent statusBarTranslucent visible={getOtpLoading}>
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: color.lightOverlay,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={35} />
        </View>
      </Modal>
      <ModalComponent
        showHeader
        title="Thông báo"
        visible={!!notiTitle}
        onClose={() => {
          setNotiTitle("");
        }}
      >
        <Text style={{ margin: 20, fontSize: 15 }}>{notiTitle}</Text>
      </ModalComponent>
      <View
        style={{
          padding: 50,
          backgroundColor: color.white1,
          gap: 50,
          height: "100%",
        }}
      >
        <Text
          style={{
            color: color.pink3,
            fontWeight: 500,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Nhập mã OTP được gửi về email của bạn
        </Text>
        <Image source={otpImg} style={{ height: 200, objectFit: "contain" }} />
        <View
          style={{
            gap: 10,
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: 800 }}>Xác thực OTP</Text>
          <OtpInput
            numberOfDigits={6}
            focusColor={color.primary3}
            onTextChange={(value) => {
              setOtp(value);
            }}
            placeholder="******"
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
                onPress={() => {
                  if (
                    verifyResponse.remainSent != null &&
                    !verifyResponse.remainSent
                  ) {
                    setNotiTitle(
                      "Bạn đã gửi OTP quá 5 lần, vui lòng thử lại sau 2 tiếng"
                    );
                  } else {
                    getOtp();
                  }
                }}
              >
                <Text style={{ color: color.pink3, fontWeight: "bold" }}>
                  Gửi OTP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: `${
                otp.length == 6 ? color.primary3 : color.grey3
              }`,
              padding: 10,
              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={otp.length != 6}
            onPress={() => {
              if (
                verifyResponse.retryTime != null &&
                !verifyResponse.retryTime
              ) {
                setNotiTitle(
                  "Bạn đã nhập sai OTP quá 5 lần, vui lòng gửi lại OTP"
                );
              } else {
                verifyOtp();
              }
            }}
          >
            {loading ? (
              <ActivityIndicator color={color.white1} />
            ) : (
              <Text style={{ color: color.white1, fontWeight: "bold" }}>
                Xác nhận
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </>
  );
}

export default OtpComponent;
