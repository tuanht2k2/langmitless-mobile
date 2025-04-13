import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import Card from "@/components/Card";
import HorizontalDivider from "@/components/HorizontalDivider";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ScrollView, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

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

  const onSubmit = async (data: any) => {};

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
                    placeholder="0đ"
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
          onClick={handleSubmit(onSubmit)}
          loading={btnLoading}
        />
      </ScrollView>
    </View>
  );
}

export default BankingScreen;
