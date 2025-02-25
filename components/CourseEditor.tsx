import color from "@/assets/styles/color";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ScrollView, TextInput, View } from "react-native";
import DropdownComponent from "./Dropdown";
import { COURSE_LEVELS, LANGUAGES } from "@/constants/constant";

interface IProps {
  control: Control<any>;
  errors: FieldErrors<{
    name: string;
    description: string;
    cost: number;
    language: string;
    level: number;
  }>;
}

function CourseEditor(props: IProps) {
  return (
    <ScrollView>
      <View style={{ gap: 10 }}>
        <DropdownComponent
          options={LANGUAGES}
          placeholder="Chọn ngôn ngữ"
          placeholderStyle={{ color: color.textGrey3 }}
          control={props.control}
          errors={props.errors}
          name="language"
        />
        <DropdownComponent
          options={COURSE_LEVELS}
          placeholder="Chọn cấp độ"
          placeholderStyle={{ color: color.textGrey3 }}
          control={props.control}
          errors={props.errors}
          name="level"
        />
        <Controller
          control={props.control}
          name="name"
          rules={{
            required: "Bạn phải nhập trường này",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                borderWidth: 1,
                borderColor: color.grey1,
                borderRadius: 7,
              }}
            >
              <TextInput
                placeholder="Tên khóa học"
                placeholderTextColor={color.textGrey3}
                style={[
                  {
                    height: 50,
                    backgroundColor: "#fff",
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    fontSize: 15,
                    flex: 1,
                  },
                  props.errors.name && { borderColor: "red", borderWidth: 1 },
                ]}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        <Controller
          control={props.control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",

                flex: 1,
                borderWidth: 1,
                borderColor: color.grey1,
                borderRadius: 7,
              }}
            >
              <TextInput
                placeholder="Mô tả khóa học"
                placeholderTextColor={color.textGrey3}
                style={[
                  {
                    height: 50,
                    backgroundColor: "#fff",
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    fontSize: 15,
                    flex: 1,
                  },
                ]}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        <Controller
          control={props.control}
          name="cost"
          rules={{
            required: "Bạn phải nhập trường này",
            pattern: {
              value: /^[0-9]*$/,
              message: "",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                borderWidth: 1,
                borderColor: color.grey1,
                borderRadius: 7,
              }}
            >
              <TextInput
                placeholder="Giá tiền"
                placeholderTextColor={color.textGrey3}
                style={[
                  {
                    height: 50,
                    backgroundColor: "#fff",
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    fontSize: 15,
                    flex: 1,
                  },
                  props.errors.cost && { borderColor: "red", borderWidth: 1 },
                ]}
                keyboardType="numeric"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value.toString()}
              />
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

export default CourseEditor;
