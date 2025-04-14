import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import AvatarComponent from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import HorizontalDivider from "@/components/HorizontalDivider";
import ModalComponent from "@/components/Modal";
import OtpComponent from "@/components/OtpComponent";
import { Interfaces } from "@/data/interfaces/model";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { RootState } from "@/redux/store";
import accountService from "@/services/accountService";
import CommonService from "@/services/CommonService";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ScrollView, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

//@ts-ignore
import bankingIcon from "@/assets/images/icons/banking.png";
import paymentService from "@/services/paymentService";

interface IConfirmModal {
  receiver: Interfaces.IUser;
  amount: number;
  message: string;
}

function BankingScreen() {
  const account = useSelector((state: RootState) => state.auth.account);

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      messasge: "Chuyển khoản",
      phoneNumber: "",
    },
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(true);
  const [confirmModalData, setConfirmModalData] =
    useState<IConfirmModal | null>(null);

  const showConfirmModal = async (data: any) => {
    try {
      if (!data.phoneNumber) return;

      setBtnLoading(true);

      const request: RequestInterfaces.ISearchAccountByPhoneNumbers = {
        phoneNumbers: [data.phoneNumber],
      };

      const res: ResponseInterfaces.ICommonResponse<Interfaces.IUser> =
        await accountService.findByPhone(request);

      if (res.code !== 200) {
        CommonService.showToast("error", res.message);
        return;
      }

      setConfirmModalData({
        receiver: res.data,
        amount: data.amount,
        message: data.messasge,
      });
    } catch (error) {
      console.log("Error:", error);
      CommonService.showToast("error", "Đã có lỗi xảy ra");
    }
    setBtnLoading(false);
  };

  const handleBanking = async () => {
    try {
      if (!confirmModalData) return;
      setBtnLoading(true);

      const request: RequestInterfaces.IEditPaymentRequest = {
        amount: confirmModalData.amount,
        description: confirmModalData.message,
        receiver: confirmModalData.receiver.id,
        status: "DONE",
        type: "TRANSFER",
      };
      const res: ResponseInterfaces.ICommonResponse<null> =
        await paymentService.create(request);
      console.log("res ne", res);
      setBtnLoading(false);
      if (res.code !== 200) {
        CommonService.showToast("error", res.message);
        return;
      } else {
        CommonService.showToast("success", "Chuyển khoản thành công");
      }
    } catch (error) {
      CommonService.showToast("error", "Đã có lỗi xảy ra");
      setBtnLoading(false);
    }
  };

  return (
    <View style={{ height: "100%", padding: 10 }}>
      {otpVerified ? (
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
                Số tiền cần chuyển(VND)
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
            <HorizontalDivider style={{ marginVertical: 10 }} />

            {/* Phone number */}
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
                Số điện thoại người nhận
              </Text>
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
                  <View>
                    <TextInput
                      placeholder="Nhập số điện thoại"
                      placeholderTextColor={color.grey3}
                      style={[
                        errors.phoneNumber &&
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
                    {errors.phoneNumber && (
                      <Text style={{ color: color.red4 }}>
                        {errors.phoneNumber.message}
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
                Nội dung chuyển khoản
              </Text>
              <Controller
                control={control}
                name="messasge"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      placeholder="Nhập nội dung"
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
            onClick={handleSubmit(showConfirmModal)}
            loading={btnLoading}
          />
        </ScrollView>
      ) : (
        <OtpComponent setOtpVerified={setOtpVerified} />
      )}
      <ModalComponent
        title="Xác nhận chuyển khoản"
        icon={"assured-workload"}
        titleStyle={{ color: color.primary1 }}
        showHeader
        visible={!!confirmModalData}
        style={{ paddingBottom: 20 }}
        onClose={() => setConfirmModalData(null)}
      >
        <View>
          <View
            style={{
              padding: 10,
              display: "flex",
              gap: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AvatarComponent
              accountUrl={confirmModalData?.receiver.profileImage}
              size={60}
            />
            <View>
              <Text>
                Tên người nhận:{"   "}
                <Text style={{ fontWeight: "bold" }}>
                  {confirmModalData?.receiver?.name}
                </Text>
              </Text>
              <Text>
                Số điện thoại người nhận{"  "}
                <Text style={{ fontWeight: "bold" }}>
                  {confirmModalData?.receiver?.phoneNumber}
                </Text>
              </Text>
              <Text>
                Số tiền chuyển khoản:{"  "}
                <Text style={{ fontWeight: "bold", color: color.red3 }}>
                  {confirmModalData?.amount} VND
                </Text>
              </Text>
              <Text>
                Nội dung chuyển khoản:{"  "}
                <Text style={{ fontWeight: "bold" }}>
                  {confirmModalData?.message}
                </Text>
              </Text>
            </View>
          </View>
          <HorizontalDivider style={{ marginVertical: 10 }} />
          <View
            style={{
              gap: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Button title="Quay lại" style={{}} onClick={() => {}}></Button>
            <Button
              title="Xác nhận"
              style={{ backgroundColor: color.grey3 }}
              onClick={() => {
                handleBanking();
              }}
            ></Button>
          </View>
        </View>
      </ModalComponent>
    </View>
  );
}

export default BankingScreen;
