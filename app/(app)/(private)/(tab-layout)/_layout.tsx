import {
  Tabs,
  useRouter,
} from "expo-router";
import React, { useContext, useEffect, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button, Dialog, Icon } from "@rneui/themed";
import { logout } from "@/redux/reducers/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AvatarComponent from "@/components/Avatar";
import color from "@/assets/styles/color";

interface ITab {
  name: string;
  title: string;
  icon: "home" | "camera" | "people" | "notifications" | "chatbox" | "settings";
}

const TABS: ITab[] = [
  { name: "index", title: "Trang chủ", icon: "home" },
];

export default function TabLayout() {
  const router = useRouter();
  const dispatch = useDispatch();

  const account = useSelector((state: RootState) => state.auth.account);

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
                source={require("@/assets/images/logo_remove_bgr.png")}
                style={styles.logo}
              />
              <Text style={styles.logoTitle}>onnectify</Text>
            </View>

            <View style={styles.actionHeaderWapper}>
              <AvatarComponent
                accountUrl={account?.id}
                imageUrl={account?.profileImage}
              />
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
