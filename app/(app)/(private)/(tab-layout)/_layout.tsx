import { Tabs, useRouter } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AvatarComponent from "@/components/Avatar";
import color from "@/assets/styles/color";

import { LinearGradient } from "expo-linear-gradient";

interface ITab {
  name: string;
  title: string;
  icon:
    | "home"
    | "camera"
    | "people"
    | "notifications"
    | "chatbox"
    | "settings"
    | "videocam"
    | "person-circle"
    | "cellular";
}

const TABS: ITab[] = [
  { name: "index", title: "Trang chủ", icon: "home" },
  {
    name: "learn-with-teacher",
    title: "Bắt đầu học tập",
    icon: "cellular",
  },
  { name: "account", title: "Tôi", icon: "person-circle" },
];

export default function TabLayout() {
  const account = useSelector((state: RootState) => state.auth.account);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShown: true,
        headerTitle: () => (
          <LinearGradient
            colors={[color.white1, color.white1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={require("@/assets/images/logo_remove_bgr.png")}
                style={styles.logo}
              />
              <Text style={styles.logoTitle}>langmitless</Text>
            </View>

            <View style={styles.actionHeaderWapper}>
              <AvatarComponent
                accountUrl={account?.id}
                imageUrl={account?.profileImage}
              />
            </View>
          </LinearGradient>
        ),
        tabBarStyle: styles.tabBar,
      }}
    >
      {TABS.map((tab) => {
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? tab.icon : `${tab.icon}-outline`}
                  color={color}
                  size={23}
                />
              ),
              // tabBarBadge: 0,
              tabBarInactiveTintColor: "gray",
            }}
          />
        );
      })}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  logoWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  logoTitle: {
    color: color.success4,
    fontSize: 17,
    fontWeight: "bold",
  },
  actionHeaderWapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  tabBar: {
    paddingBottom: 10,
    paddingTop: 5,
    height: 60,
    backgroundColor: "#fff",
  },
  dialogHeader: {
    width: "100%",
    textAlign: "center",
    fontSize: 16,
  },
  dialogButtonWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: 30,
    gap: 20,
  },
});
