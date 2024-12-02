import React from "react";
import { Slot } from "expo-router";
import * as Linking from "expo-linking";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";

// const linking: LinkingOptions<{
//   index: undefined;
//   payment: {
//     index: undefined;
//     success: undefined;
//   };
// }> = {
//   prefixes: [Linking.createURL("/")],
//   config: {
//     screens: {
//       index: "",
//       payment: {
//         index: "",
//         success: "success",
//       },
//     },
//   },
// };

export default function AppLayout() {
  return (
    // <NavigationContainer linking={linking}>
      <Slot />
    // </NavigationContainer>
  );
}
