import color from "@/assets/styles/color";
import { Skeleton } from "@rneui/themed";
import React from "react";

import { View, ViewStyle } from "react-native";

interface IProps {
  hasCircle?: boolean;
  length: number;
  style?: ViewStyle;
}

function ListSkeleton(props: IProps) {
  return (
    <View style={{ gap: 5, ...props.style }}>
      {[...Array(props.length).keys()].map((_, index) => (
        <View
          key={index}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          {props.hasCircle && (
            <Skeleton
              circle={true}
              height={20}
              width={20}
              style={{ backgroundColor: color.primary2 }}
            />
          )}
          <Skeleton style={{ backgroundColor: color.primary2, flex: 1 }} />
        </View>
      ))}
    </View>
  );
}

export default ListSkeleton;
