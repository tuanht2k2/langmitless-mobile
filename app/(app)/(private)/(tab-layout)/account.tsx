import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import { logout } from "@/redux/reducers/authSlice";
import { RootState } from "@/redux/store";
import crashService from "@/services/crashService";
import testConnectionService from "@/services/testConnectionService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "@rneui/themed";
import { Href, Link, useRouter } from "expo-router";
import React from "react";

import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface IMenuItem {
  icon: string;
  name: string;
  to: Href<string | object>;
  color: string;
}

const MENU: IMenuItem[] = [
  {
    icon: "account-circle",
    name: "Thông tin cá nhân",
    to: "/profile",
    color: color.primary5,
  },
  {
    icon: "cast-for-education",
    name: "Trở thành giáo viên",
    to: "/teacher",
    color: color.primary5,
  },
  {
    icon: "settings",
    name: "Cài đặt",
    to: "/settings",
    color: color.primary5,
  },
];

function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const apiUrl = useSelector((state: RootState) => state.global.apiUrl);

  const handleLogout = () => {
    AsyncStorage.clear().then(() => {
      dispatch(logout());
      router.replace("/login");
    });
  };

  const testConnection = async () => {
    // const res = await testConnectionService(apiUrl);
    const res = await testConnectionService("http://3.101.24.105:8080/api/v1");
    console.log(res.data);
  };

  return (
    <View
      style={{
        ...GlobalStyle.background,
        padding: 10,
        gap: 5,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              ...GlobalStyle.mainText,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Menu
          </Text>
        </View>
        <View style={{ gap: 10 }}>
          {MENU.map((item, index) => (
            <Link
              key={index}
              href={item.to}
              style={{
                width: "100%",
                backgroundColor: color.white1,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: color.grey2,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  padding: 10,
                }}
              >
                <Icon name={item.icon} color={item.color} />
                <Text style={{ fontWeight: "bold", color: color.textMain }}>
                  {item.name}
                </Text>
              </View>
            </Link>
          ))}
        </View>
      </View>
      <TouchableOpacity onPress={testConnection}>
        <Text
          style={{
            color: color.textMain,
            fontWeight: "bold",
            fontSize: 15,
            textAlign: "center",
            borderRadius: 10,
            backgroundColor: color.white1,
            padding: 10,
            borderWidth: 1,
            borderColor: color.grey2,
          }}
        >
          Kiểm tra kết nối
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text
          style={{
            color: color.textMain,
            fontWeight: "bold",
            fontSize: 15,
            textAlign: "center",
            borderRadius: 10,
            backgroundColor: color.white1,
            padding: 10,
            borderWidth: 1,
            borderColor: color.grey2,
          }}
        >
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileScreen;
