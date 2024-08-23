import { logout } from "@/redux/reducers/authSlice";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View, Button } from "react-native";
import { useDispatch } from "react-redux";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
    dispatch(logout());
  };

  return (
    <View style={styles.bg}>
      <Text>Hello android</Text>
      <Button
        onPress={() => {
          handleLogout();
        }}
        title="Đăng xuất"
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    padding: 20,
  },
});
