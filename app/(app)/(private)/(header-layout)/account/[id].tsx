import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

import { Text, View } from "react-native";

const AccountScreen = () => {
  const { id } = useLocalSearchParams();

  useEffect(() => {}, []);
  return (
    <View>
      <Text>account {id}</Text>
    </View>
  );
};

export default AccountScreen;
