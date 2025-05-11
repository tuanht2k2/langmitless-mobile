import React from "react";
import { View, Text, StyleSheet, ScrollView, ViewStyle } from "react-native";
import { ResponseInterfaces } from "@/data/interfaces/response";
import GlobalStyle from "@/assets/styles/globalStyles";
import color from "@/assets/styles/color";

interface IProps {
  data: ResponseInterfaces.ITopicResponse[];
  actionBody?: (item: ResponseInterfaces.ITopicResponse) => React.ReactNode;
  style?: ViewStyle;
}

const TopicListByCourse = ({ data, actionBody, style }: IProps) => {
  return (
    <ScrollView style={{ width: "100%" }}>
      <View style={{ gap: 5, ...style }}>
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              ...GlobalStyle.horizontalFlex,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              borderWidth: 1,
              borderColor: color.pink1,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <View
              style={{
                ...GlobalStyle.horizontalFlex,
                gap: 8,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 16, color: color.textMain }}>
                {index + 1}.
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: color.textMain,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                {item.description}
              </Text>
            </View>
            {actionBody && actionBody(item)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TopicListByCourse;
