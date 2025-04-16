import React from "react";

import color from "@/assets/styles/color";
import { ComponentInterfaces } from "@/constants/component";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface IProps {
  tabs: ComponentInterfaces.ITab[];
  activeIndex: number;
  onChange: (index: number) => void;
  tabStyles?: ViewStyle;
  styles?: ViewStyle;
}

function Tabs(props: IProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ gap: 10, flexDirection: "row", ...props.styles }}>
        {props.tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor:
                props.activeIndex === index ? color.blue1 : color.white1,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
              height: 40,
              ...props.tabStyles,
            }}
            onPress={() => props.onChange(index)}
          >
            <Text
              style={{
                color:
                  props.activeIndex === index ? color.yellow1 : color.pink3,
                fontSize: 16,
              }}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default Tabs;
