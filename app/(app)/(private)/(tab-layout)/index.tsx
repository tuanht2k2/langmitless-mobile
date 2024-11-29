import { Link, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import AvatarComponent from "@/components/Avatar";
import { RootState } from "@/redux/store";
import color from "@/assets/styles/color";
import FullScreenLoadingComponent from "@/components/FullScreenActivityIndicator";
import Card from "@/components/Card";
import backgroundImg from "@/assets/images/bgr_1.jpg";
import { ComponentIntefaces } from "@/constants/component";
import MenuItem from "@/components/MenuItem";
import HorizontalDivider from "@/components/HorizontalDivider";
import GlobalStyle from "@/assets/styles/globalStyles";

const MENU: ComponentIntefaces.IMenuItem[] = [
  {
    name: "Nạp tiền",
    icon: "payments",
    to: "/payment",
    iconColor: color.danger3,
    labelColor: color.textMain,
  },
  {
    name: "Chuyển tiền",
    icon: "move-up",
    to: "/payment",
    iconColor: color.primary3,
    labelColor: color.textMain,
  },
];

export default function HomeScreen() {
  const account = useSelector((state: RootState) => state.auth.account);

  const dispatch = useDispatch();
  const router = useRouter();

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
    <ImageBackground style={styles.bg} source={backgroundImg}>
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
                }}
              >
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 20 }}
                >
                  {MENU.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
                </View>
                <HorizontalDivider />
                <View style={{ padding: 5 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      ...GlobalStyle.mainText,
                    }}
                  >
                    Tổng số dư: VND
                  </Text>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {account?.balance}
                  </Text>
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
  bg: {
    height: "100%",
  },
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
