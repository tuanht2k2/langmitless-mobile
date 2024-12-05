import { RootState } from "@/redux/store";
import React from "react";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";

import Button from "@/components/Button";
import GlobalStyle from "@/assets/styles/globalStyles";
import { useRouter } from "expo-router";
import { ComponentIntefaces } from "@/constants/component";
import color from "@/assets/styles/color";
import Card from "@/components/Card";
import MenuItem from "@/components/MenuItem";
import HorizontalDivider from "@/components/HorizontalDivider";
import { Icon } from "@rneui/themed";

interface IRoute {
  name: string;
  title: string;
}

const MENU: ComponentIntefaces.IMenuItem[] = [
  {
    name: "Topic",
    to: "/topic",
    iconColor: color.danger3,
    labelColor: color.textMain,
    icon: "topic",
  },
  {
    name: "Kết nối",
    to: "/payment/success",
    iconColor: color.primary3,
    labelColor: color.textMain,
    icon: "join-right",
  },
];
function TeacherScreen() {
  const account = useSelector((state: RootState) => state.auth.account);

  const router = useRouter();

  const handleNavigate = () => {
    router.push("/become-a-teacher");
  };

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
          <Button onClick={handleNavigate} title="Đăng ký ngay" />
        </View>
      ) : (
        <View>
          <Card
            styles={{
              gap: 10,
              marginTop: 20,
              borderWidth: 1,
              borderColor: color.grey2,
            }}
          >
            <Text style={{ ...GlobalStyle.mainText, fontWeight: "bold" }}>
              Công cụ của bạn
            </Text>
            <HorizontalDivider />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 20,
              }}
            >
              {MENU.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </View>
          </Card>
          <Card
            styles={{
              gap: 10,
              marginTop: 20,
              borderWidth: 1,
              borderColor: color.grey2,
            }}
          >
            <Text style={{ ...GlobalStyle.mainText, fontWeight: "bold" }}>
              Bảng tin
            </Text>
            <HorizontalDivider />
          </Card>
        </View>
      )}
    </View>
  );
}

export default TeacherScreen;
