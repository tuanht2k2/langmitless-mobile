import { Link, useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";

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
import GlobalStyle from "@/assets/styles/globalStyles";

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
    to: "/payment/query",
    iconColor: color.warning3,
    labelColor: color.textMain,
    icon: "query-stats",
  },
];

export default function HomeScreen() {
  const account = useSelector((state: RootState) => state.auth.account);

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
    <ImageBackground style={GlobalStyle.background} source={backgroundImg}>
      <View style={{ marginTop: 40, marginBottom: 0, gap: 5 }}>
        <ScrollView scrollEventThrottle={16}>
          {isLoading ? (
            <FullScreenLoadingComponent />
          ) : (
            <View
              style={{
                width: "100%",
                padding: 20,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
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
                        fontSize: 15,
                        fontWeight: "semibold",
                        color: color.textWhite2,
                      }}
                    >
                      Xin chào,
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: color.textWhite2,
                      }}
                    >
                      {account?.name}
                    </Text>
                  </View>
                </View>
              </View>
              <Card
                styles={{
                  gap: 10,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: color.grey2,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 20,
                    padding: 5,
                  }}
                >
                  {MENU.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
                </View>
                <HorizontalDivider style={{ backgroundColor: color.pink3 }} />
                <View
                  style={{
                    padding: 5,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon name="attach-money" color={"red"} />
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: color.grey4,
                      }}
                    >
                      Số dư
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: color.textMain,
                      }}
                    >
                      {account?.balance} VND
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  createPostWrapper: {
    marginTop: 5,
    padding: 10,
    paddingVertical: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: color.white1,
    shadowColor: color.black1,
    shadowOffset: { width: 300, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 4,
    position: "relative",
  },
  createPostButton: {
    fontSize: 17,
    borderRadius: 15,
    padding: 10,
    flex: 1,
    paddingLeft: 20,
    backgroundColor: color.grey5,
  },
});
