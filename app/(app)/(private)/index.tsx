import { logout } from "@/redux/reducers/authSlice";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View, Button } from "react-native";
import { useDispatch } from "react-redux";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  return <View style={styles.bg}></View>;
}

const styles = StyleSheet.create({
  bg: {
    padding: 20,
  },
});
