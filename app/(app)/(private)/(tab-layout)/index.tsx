import {
  Text,
  View,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { Icon } from "@rneui/themed";
import AvatarComponent from "@/components/Avatar";

import { RootState } from "@/redux/store";

import Card from "@/components/Card";
import MenuItem from "@/components/MenuItem";
import FullScreenLoadingComponent from "@/components/FullScreenActivityIndicator";
import HorizontalDivider from "@/components/HorizontalDivider";
import { ComponentInterfaces } from "@/constants/component";

import color from "@/assets/styles/color";

// @ts-ignore
import backgroundImg from "@/assets/images/bgr_1.jpg";
// @ts-ignore
import messengerIcon from "@/assets/images/icons/messenger.png";
// @ts-ignore
import chatbotIcon from "@/assets/images/icons/chatbot.png";

import GlobalStyle from "@/assets/styles/globalStyles";
import CommonService from "@/services/CommonService";
import accountService from "@/services/accountService";
import {
  overlayLoaded,
  overlayLoading,
  showChatbot,
  showMessenger,
} from "@/redux/reducers/globalSlide";
import { loadAccount } from "@/redux/reducers/authSlice";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const account = useSelector((state: RootState) => state.auth.account);
  const dispatch = useDispatch();

  const getAccountDetail = async () => {
    try {
      if (!account || !account.id) return;
      dispatch(overlayLoading());
      const res = await accountService.getAccount(account.id);
      dispatch(overlayLoaded());
      const data = res.data?.data;
      if (data) {
        dispatch(loadAccount(data));
      }
    } catch (error) {
      console.log(
        "An error happened when HomeScreen - getAccountDetail",
        error
      );
      CommonService.showToast("error", "Đã xảy ra lỗi!");
      dispatch(overlayLoaded());
    }
  };

  const MENU: ComponentInterfaces.IMenuItem[] = [
    {
      name: "Nạp tiền",
      to: "/payment",
      iconColor: color.danger3,
      labelColor: color.textMain,
      icon: "payments",
    },
    {
      name: "Chuyển tiền",
      to: "/banking",
      iconColor: color.primary3,
      labelColor: color.textMain,
      icon: "move-down",
    },
    {
      name: "Truy vấn",
      iconColor: color.warning3,
      labelColor: color.textMain,
      icon: "query-stats",
    },

    {
      name: "Trò chuyện",
      iconColor: color.warning3,
      labelColor: color.textMain,
      img: messengerIcon,
      onClick: () => {
        dispatch(showMessenger());
      },
    },
    {
      name: "Chatbot",
      iconColor: color.warning3,
      labelColor: color.textMain,
      img: chatbotIcon,
      onClick: () => {
        dispatch(showChatbot());
      },
    },
    {
      iconColor: color.warning3,
      labelColor: color.textMain,
      icon: "data-usage",
      onClick: getAccountDetail,
    },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();

    return () => {};
  }, []);

  return (
    <LinearGradient
      colors={["#3498db", "#6a82fb", "#9b59b6", "#6a82fb", "#3498db"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.25, 0.5, 0.75, 1]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading ? (
          <FullScreenLoadingComponent />
        ) : (
          <View style={styles.content}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 12,
                backgroundColor: "#6a82fb33", // xanh tím nhạt trong suốt
                borderRadius: 16,
              }}
            >
              <AvatarComponent
                accountUrl={account?.id}
                imageUrl={account?.profileImage}
                size={50}
              />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#4a3f9e",
                    marginBottom: 4,
                  }}
                >
                  Xin chào,
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#342c75",
                  }}
                >
                  {account?.name}
                </Text>
              </View>
            </View>

            {/* Menu Card */}
            <Card
              styles={{
                marginTop: 20,
                padding: 16,
                borderRadius: 16,
                backgroundColor: color.white1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                gap: 16,
              }}
            >
              <View style={styles.menuWrap}>
                {MENU.map((item, index) => (
                  <MenuItem key={index} {...item} />
                ))}
              </View>

              <HorizontalDivider style={{ backgroundColor: color.pink3 }} />

              {/* Balance Box */}
              <View style={styles.balanceBox}>
                <Icon
                  name="attach-money"
                  color={color.success3}
                  size={28}
                  style={{ marginRight: 10 }}
                />
                <View>
                  <Text style={styles.balanceLabel}>Số dư</Text>
                  <Text style={styles.balanceValue}>
                    {account?.balance?.toLocaleString("vi-VN")} VND
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    width: "100%",
  },
  greetingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: color.primary4,
    padding: 16,
    borderRadius: 12,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: "600",
    color: color.textWhite2,
    marginBottom: 2,
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
    color: color.textWhite2,
  },
  menuWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center",
  },
  balanceBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.grey1,
    padding: 12,
    borderRadius: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: color.textGrey4,
    marginBottom: 2,
  },
  balanceValue: {
    fontWeight: "bold",
    fontSize: 16,
    color: color.textMain,
  },
});
