import color from "@/assets/styles/color";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface IRoute {
  name: string;
  title: string;
}

const ROUTES: IRoute[] = [
  {
    name: "payment",
    title: "Nạp tiền",
  },
  {
    name: "payment-success",
    title: "Thanh toán thành công",
  },
  {
    name: "banking",
    title: "Chuyển tiền",
  },
  {
    name: "payment-query",
    title: "Truy vấn giao dịch",
  },
  {
    name: "settings",
    title: "Cài đặt",
  },
  {
    name: "teacher",
    title: "Chế độ giáo viên",
  },
  {
    name: "profile",
    title: "Thông tin cá nhân",
  },
  {
    name: "become-a-teacher",
    title: "Đăng ký trở thành giáo viên",
  },
  {
    name: "learn-with-teacher/[id]",
    title: "Học cùng giáo viên",
  },
  {
    name: "room/[roomId]",
    title: "Học cùng giáo viên",
  },
  {
    name: "teacher-management/course/index",
    title: "Khóa học của bạn",
  },
  { name: "courses", title: "Khóa học" },
];

export default function HeaderLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      {ROUTES.map((route: IRoute, index) => (
        <Stack.Screen
          key={index}
          name={route.name}
          options={{
            headerTitle: route.title,
            headerStyle: styles.header,
            headerTitleStyle: styles.headerText,
          }}
        />
      ))}
      <Stack.Screen
        key={ROUTES.length}
        name="course"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {},
  headerText: {
    fontSize: 17,
    fontWeight: "600",
    color: color.textMain,
  },
});
