import color from "@/assets/styles/color";
import React from "react";
import { ComponentInterfaces } from "@/constants/component";
import { Icon, Text } from "@rneui/themed";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  Image,
  StyleProp,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface IProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
  name: string;
  options: ComponentInterfaces.IDropdownOption<any>[];
  placeholder?: string;
  style?: ViewStyle;
  placeholderStyle?: StyleProp<TextStyle>;
  size?: number;
  filter?: boolean;
}

function DropdownComponent(props: IProps) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={{
        required: "Trường này không được để trống",
      }}
      render={({ field: { onChange, onBlur, value } }) => {
        const selectedItem = props.options.find((item) => item.code === value);
        return (
          <Dropdown
            style={{
              borderColor: props.errors?.[props.name]
                ? color.red3
                : color.transparent,
              borderWidth: 1,
              padding: 13,
              borderRadius: 8,
              ...props.style,
            }}
            data={props.options}
            labelField="name"
            valueField="code"
            placeholder={props.placeholder}
            placeholderStyle={props.placeholderStyle}
            search={props.filter}
            searchPlaceholder="Nhập từ khóa tìm kiếm..."
            renderItem={(item: ComponentInterfaces.IDropdownOption<any>) => {
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  {item.icon && <Icon name={item.icon} color={color.grey4} />}
                  {item.img && (
                    <Image
                      source={item.img}
                      style={{
                        height: props.size || 20,
                        width: props.size || 20,
                        borderRadius: 5,
                      }}
                    />
                  )}
                  <Text>{item.name}</Text>
                </View>
              );
            }}
            renderLeftIcon={() => (
              <View>
                {selectedItem && selectedItem.icon && (
                  <Icon
                    name={selectedItem.icon}
                    color={color.grey4}
                    style={{ marginRight: 10 }}
                  />
                )}
                {selectedItem && selectedItem.img && (
                  <Image
                    source={selectedItem.img}
                    style={{
                      height: props.size || 20,
                      width: props.size || 20,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  />
                )}
              </View>
            )}
            value={value}
            onChange={(item) => {
              onChange(item.code);
            }}
            onBlur={onBlur}
          />
        );
      }}
    />
  );
}

export default DropdownComponent;
