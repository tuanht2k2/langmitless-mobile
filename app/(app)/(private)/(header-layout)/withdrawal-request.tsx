import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import Button from "@/components/Button";
import Card from "@/components/Card";
import HorizontalDivider from "@/components/HorizontalDivider";
import ModalComponent from "@/components/Modal";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { RootState } from "@/redux/store";
import CommonService from "@/services/CommonService";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Image, ScrollView, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

import { useRouter } from "expo-router";
import withdrawalRequestService from "@/services/withdrawalRequestService";

// @ts-ignore
import successIcon from "@/assets/images/icons/success.png";

function WithdrawalRequestScreen() {
  const account = useSelector((state: RootState) => state.auth.account);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [successModalVisible, setModalSuccessVisible] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setBtnLoading(true);

      const request: RequestInterfaces.IEditWithdrawalRequest = {
        amount: data.amount,
        description: data.description,
      };
      const res: ResponseInterfaces.ICommonResponse<null> =
        await withdrawalRequestService.create(request);
      setBtnLoading(false);
      if (res.code !== 200) {
        CommonService.showToast("error", res.message);
        return;
      }
      setModalSuccessVisible(true);
    } catch (error) {
      CommonService.showToast("error", "Đã có lỗi xảy ra");
      setBtnLoading(false);
    }
  };

  const navigate = () => {
    setModalSuccessVisible(false);
    router.replace("/");
  };

  return (
    <View style={{ height: "100%", padding: 10 }}>
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
              Số tiền cần rút(VND)
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
                max: {
                  value: account?.balance || 0,
                  message: "Số dư của bạn không đủ",
                },
                validate: (value) => {
                  const numValue = Number(value);
                  if (isNaN(numValue)) {
                    return "Số tiền phải là một số hợp lệ";
                  }
                  if (numValue > (account?.balance || 0)) {
                    return "Số dư của bạn không đủ";
                  }
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
                      errors.amount && {
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
              Lời nhắn
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    placeholder="Nhập nội dung..."
                    placeholderTextColor={color.grey3}
                    style={[
                      {
                        paddingVertical: 5,
                        fontWeight: "semibold",
                        fontSize: 16,
                        color: color.grey5,
                      },
                    ]}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
          </View>
        </Card>

        <Button
          title="Xác nhận"
          style={{ marginTop: 15 }}
          onClick={handleSubmit(onSubmit)}
          loading={btnLoading}
        />
      </ScrollView>
      <ModalComponent
        visible={successModalVisible}
        style={{ gap: 20, paddingBottom: 10 }}
        showHeader
        title="Thông báo"
        onClose={() => {
          setModalSuccessVisible(false);
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image source={successIcon} style={{ height: 30, width: 30 }} />
          <Text style={{ fontSize: 17, fontWeight: "400" }}>
            Gửi yêu rút tiền thành công
          </Text>
        </View>
        <Button
          style={{ backgroundColor: color.blue1, marginHorizontal: 10 }}
          title="Xác nhận"
          onClick={navigate}
        />
      </ModalComponent>
    </View>
  );
}

export default WithdrawalRequestScreen;
