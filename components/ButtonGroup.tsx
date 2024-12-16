import { ComponentInterfaces } from "@/constants/component";
import { Icon } from "@rneui/themed";
import React from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";

import color from "@/assets/styles/color";

interface IProps {
  options: ComponentInterfaces.IButtonGroupItem[];
  onChange: (value: any) => void;
  value?: any;
  defaultValue?: any;
}

function ButtonGroup(props: IProps) {
  return (
    <View style={{ gap: 15, paddingVertical: 10 }}>
      {props.options.map(
        (item: ComponentInterfaces.IButtonGroupItem, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              style={
                item.code === props.value
                  ? { ...style.active, ...style.wrapper }
                  : style.wrapper
              }
              onPress={() => {
                props.onChange(item.code);
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {item.img && (
                  <Image
                    source={item.img}
                    style={{ height: 30, width: 30, objectFit: "contain" }}
                  />
                )}

                {item.icon && <Icon name={item.icon} />}
                <View>
                  {item.name && <Text>{item.name}</Text>}
                  {item.description && (
                    <Text style={{ color: color.grey5 }}>
                      {item.description}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
}

const style = StyleSheet.create({
  active: {
    backgroundColor: color.pink1,
    borderWidth: 2,
    borderColor: color.pink2,
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
  },
});

export default ButtonGroup;
