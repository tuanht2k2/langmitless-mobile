import React from "react";

import color from "@/assets/styles/color";
import { ComponentInterfaces } from "@/constants/component";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Card from "./Card";

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
              borderRadius: 10,
              height: 40,
              ...props.tabStyles,
            }}
            onPress={() => props.onChange(index)}
          >
            <Text
              style={{
                color:
                  props.activeIndex === index ? color.yellow1 : color.pink3,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {tab.title}
            </Text>
            {tab.image && <Image source={tab.image} width={30} height={30} />}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default Tabs;
