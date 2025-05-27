import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import { ComponentInterfaces } from "@/constants/component";
import { LANGUAGES } from "@/constants/constant";
import { ResponseInterfaces } from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import React from "react";
import { Image, ScrollView, Text, View, ViewStyle } from "react-native";

interface IProps {
  data: ResponseInterfaces.ICourseResponse[];
  actionBody?: (item: ResponseInterfaces.ICourseResponse) => React.ReactNode;
  style?: ViewStyle;
}

function CourseList(props: IProps) {
  const { data, actionBody } = props;

  return (
    <ScrollView style={{ width: "100%" }}>
      <View style={{ gap: 5, ...props.style }}>
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              ...GlobalStyle.horizontalFlex,
              alignItems: "center",
              gap: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: color.pink1,

              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                ...GlobalStyle.horizontalFlex,
                alignItems: "center",
                gap: 10,
                padding: 10,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: color.textMain,
                  minWidth: 30,
                }}
              >
                {index + 1}.
              </Text>
              <View
                style={{
                  ...GlobalStyle.horizontalFlex,
                  alignItems: "center",
                  gap: 5,
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={CommonService.getCourseLanguage(item.language)?.img}
                  style={{ height: 20, width: 20, borderRadius: 10 }}
                />
                <Text
                  style={{
                    ...GlobalStyle.mainText,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: color.warning3,
                }}
              >
                {item.cost}
              </Text>
            </View>
            {actionBody && actionBody(item)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default CourseList;
