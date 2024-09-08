import {
  Link,
  Redirect,
  Slot,
  Tabs,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import React, { useContext, useEffect, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button, Dialog, Icon } from "@rneui/themed";
import { loadAccount, logout } from "@/redux/reducers/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import accountService from "@/services/accountService";
import { Interfaces } from "@/data/interfaces/model";
import { loaded } from "@/redux/reducers/globalSlide";

interface ITokenData {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  id: string;
}

interface ITab {
  name: string;
  title: string;
  icon: "home" | "camera" | "people" | "notifications" | "chatbox" | "settings";
}

const TABS: ITab[] = [
  { name: "index", title: "Trang chủ", icon: "home" },
  { name: "reels", title: "Thước phim", icon: "camera" },
  { name: "friend-requests", title: "Kết bạn", icon: "people" },
  { name: "notifications", title: "Thông báo", icon: "notifications" },
  { name: "messenger", title: "Trò chuyện", icon: "chatbox" },
];

export default function TabLayout() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [account, setAccount] = useState<Interfaces.IAccount | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (!token) return;
      const data: ITokenData = jwtDecode(token);
      dispatch(loadAccount(data?.id));

      accountService
        .getAccount(data?.id)
        .then((res) => {
          const data = res.data?.data;
          if (data) setAccount(data);
          dispatch(loaded());
        })
        .catch((e) => {
          AsyncStorage.clear().then(() => {
            dispatch(logout());
          });
        });
    });

    return () => {};
  }, []);

  const handleLogout = () => {
    AsyncStorage.clear().then(() => {
      dispatch(logout());
      setIsDialogVisible(false);
      router.replace("/login");
    });
  };

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);

  const toggleDialog = () => {
    setIsDialogVisible(!isDialogVisible);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShown: true,
        headerTitle: () => (
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.logoTitle}>onnectify</Text>
            </View>

            <View style={styles.actionHeaderWapper}>
              {/* <Link
                href={{
                  pathname: "/accounts/[id]",
                  params: { id: account?.id },
                }}
                style={styles.profileImageWrapper}
              >
                <Image
                  source={
                    account?.profileImage ||
                    require("@/assets/images/default_avt.png")
                  }
                  style={styles.profileImage}
                />
              </Link> */}
              <TouchableOpacity onPress={toggleDialog} activeOpacity={0.7}>
                <Icon name="logout" color={"gray"} />
              </TouchableOpacity>
            </View>
            <Dialog isVisible={isDialogVisible} onBackdropPress={toggleDialog}>
              <View>
                <Text style={styles.dialogHeader}>
                  Bạn có muốn đăng xuất không?
                </Text>
                <View style={styles.dialogButtonWrapper}>
                  <Button
                    title="Không"
                    color={"primary"}
                    buttonStyle={{
                      borderRadius: 8,
                    }}
                    onPress={toggleDialog}
                  ></Button>
                  <Button
                    title="Có"
                    color={"secondary"}
                    buttonStyle={{
                      borderRadius: 8,
                      minWidth: 70,
                    }}
                    onPress={handleLogout}
                  ></Button>
                </View>
              </View>
            </Dialog>
          </View>
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
  },
  logoWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  logoTitle: {
    color: "#01084a",
    fontSize: 20,
  },
  actionHeaderWapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  profileImageWrapper: {
    height: 30,
    width: 30,
    borderRadius: 50,
    overflow: "hidden",
    cursor: "pointer",
    borderBlockColor: "#0b83bf",
    borderWidth: 1,
  },
  profileImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
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
