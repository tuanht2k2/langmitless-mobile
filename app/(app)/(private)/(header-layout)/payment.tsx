import {
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import Card from "@/components/Card";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import GlobalStyle from "@/assets/styles/globalStyles";
import HorizontalDivider from "@/components/HorizontalDivider";
import { Controller, useForm } from "react-hook-form";
import { ComponentIntefaces } from "@/constants/component";

import momoIcon from "@/assets/images/icons/momo.png";
import vnpayIcon from "@/assets/images/icons/vnpay.png";
import color from "@/assets/styles/color";
import ButtonGroup from "@/components/ButtonGroup";
import Button from "@/components/Button";
import momoService from "@/services/momoService";
import CommonService from "@/services/CommonService";
import WebViewComponent from "@/components/WebView";

function PaymentScreen() {
  const account = useSelector((state: RootState) => state.auth.account);

  const [btnLoading, setBtnLoading] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("");

  const paymentMethods: ComponentIntefaces.IButtonGroupItem[] = [
    {
      name: "Ví MoMo",
      code: "MOMO",
      img: momoIcon,
      description: "Miễn phí thanh toán",
    },
    {
      name: "VNPAY",
      code: "VNPAY",
      img: vnpayIcon,
      description: "Miễn phí thanh toán",
    },
  ];

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      orderInfo: "Nạp tiền vào tài khoản",
      method: "MOMO",
    },
  });

  const handleCreateMomoPayment = async (data: any) => {
    try {
      const request = {
        amount: parseInt(data.amount || 0),
        description: data.orderInfo,
      };
      const res = await momoService.create(request);
      const url = res.data?.payUrl;
      setWebViewUrl(url);
      setBtnLoading(false);
    } catch (error) {
      CommonService.showToast("error", "Đã xảy ra lỗi!");
      setBtnLoading(false);
      return;
    }
  };
  const handleCreateVNPayPayment = async (data: any) => {};

  const onSubmit = async (data: any) => {
    setBtnLoading(true);
    if (data.method === "MOMO") {
      handleCreateMomoPayment(data);
    } else {
      handleCreateVNPayPayment(data);
    }
  };

  return (
    <ImageBackground style={{ height: "100%", padding: 10 }}>
      {webViewUrl && <WebViewComponent uri={webViewUrl} />}
      {!webViewUrl && (
        <ScrollView>
          <Card>
            <View style={{ padding: 5 }}>
              <Text
                style={{
                  ...GlobalStyle.mainText,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Tổng số dư: VND
              </Text>
              <Text
                style={{
                  fontWeight: "semibold",
                  fontSize: 16,
                  color: color.grey5,
                }}
              >
                {account?.balance}
              </Text>
            </View>
            <HorizontalDivider style={{ marginVertical: 10 }} />
            <View
              style={{
                borderColor: color.primary1,
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  ...GlobalStyle.mainText,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Số tiền cần nạp(VND)
              </Text>
              <Controller
                control={control}
                name="amount"
                rules={{
                  required: "Vui lòng nhập số tiền",
                  min: {
                    value: 10000,
                    message: "Số tiền tối thiểu là 10.000VND",
                  },
                  // max: {
                  //   value: account?.balance || 0,
                  //   message: "Số dư của bạn không đủ",
                  // },
                  validate: (value) => {
                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                      return "Số tiền phải là một số hợp lệ";
                    }
                    // if (numValue > (account?.balance || 0)) {
                    //   return "Số dư của bạn không đủ";
                    // }
                    if (numValue < 10000) {
                      return "Số tiền tối thiểu là 10.000VND";
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      placeholder="0đ"
                      placeholderTextColor={color.grey3}
                      style={[
                        errors.amount &&
                          {
                            // borderColor: color.red1,
                            // borderWidth: 1,
                          },
                        {
                          paddingVertical: 5,
                          fontWeight: "semibold",
                          fontSize: 16,
                          color: color.grey5,
                        },
                      ]}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.amount && (
                      <Text style={{ color: color.red4 }}>
                        {errors.amount.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </Card>
          <Card styles={{ marginTop: 15 }}>
            <Text style={{ fontSize: 15 }}>Phương thức thanh toán</Text>
            <Controller
              control={control}
              name="method"
              render={({ field: { onChange, value } }) => (
                <ButtonGroup
                  options={paymentMethods}
                  value={value}
                  onChange={onChange}
                  defaultValue={paymentMethods[0].code}
                />
              )}
            />
          </Card>
          <Button
            title="Xác nhận"
            style={{ marginTop: 15 }}
            onClick={handleSubmit(onSubmit)}
            loading={btnLoading}
          />
        </ScrollView>
      )}
    </ImageBackground>
  );
}

export default PaymentScreen;
