import { RootState } from "@/redux/store";
import React from "react";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";

import educationImg from "@/assets/images/education.png";
import Button from "@/components/Button";
import GlobalStyle from "@/assets/styles/globalStyles";

function TeacherScreen() {
  const account = useSelector((state: RootState) => state.auth.account);

  return (
    <View>
      {account?.role !== "TEACHER" ? (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* <Image
            source={educationImg}
            style={{
              objectFit: "contain",
              height: 100,
              width: "50%",
            }}
          /> */}
          <Text
            style={{
              ...GlobalStyle.mainText,
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 20,
            }}
          >
            Bạn chưa phải là giáo viên
          </Text>
          <Button title="Đăng ký ngay" />
        </View>
      ) : (
        <View>your are teacher</View>
      )}
    </View>
  );
}

export default TeacherScreen;
