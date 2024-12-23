import { useCourse } from "@/contexts";
import CourseProvider from "@/contexts/courseContext/CourseProvider";
import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

interface IRoute {
  name: string;
  title: string;
}

const ROUTES: IRoute[] = [
  {
    name: "[courseId]",
    title: "Thông tin khóa học",
  },
];

function CourseLayout() {
  return (
    <CourseProvider>
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
              // headerStyle: styles.header,
              // headerTitleStyle: styles.headerText,
            }}
          />
        ))}
      </Stack>
    </CourseProvider>
  );
}

export default CourseLayout;
