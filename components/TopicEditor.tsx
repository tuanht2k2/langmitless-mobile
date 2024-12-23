import color from "@/assets/styles/color";
import React, { useEffect, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ScrollView, Text, TextInput, View } from "react-native";
import DropdownComponent from "./Dropdown";
import { LANGUAGES } from "@/constants/constant";
import { ResponseInterfaces } from "@/data/interfaces/response";
import tagService from "@/services/tagService";
import { RequestInterfaces } from "@/data/interfaces/request";
import { useDebouncedCallback } from "use-debounce";
import { useCourse } from "@/contexts";
import GlobalStyle from "@/assets/styles/globalStyles";
import Button from "./Button";

interface IProps {
  control: Control<any>;
  errors: FieldErrors<{
    description: string;
    tagId: string;
    courseId: number;
  }>;
}

function TopicEditor(props: IProps) {
  const [tags, setTags] = useState<ResponseInterfaces.ITagResponse[]>([]);

  const { course } = useCourse();

  const searchTags = async () => {
    if (!course) return;

    const request: RequestInterfaces.ISearchTagRequest = {
      name: "",
      language: course.language,
    };
    const res = await tagService.search(request);
    if (res.data && res.data.length > 0) setTags(res.data);
  };

  useEffect(() => {
    searchTags();
  }, []);

  return (
    <ScrollView>
      <View style={{ gap: 10 }}>
        <View
          style={{
            ...GlobalStyle.horizontalFlex,
            justifyContent: "space-between",
          }}
        >
          <Text>Chọn từ khóa</Text>
          <Button
            title="Tạo từ khóa mới"
            style={{ padding: 8 }}
            fontSize={13}
          />
        </View>
        <DropdownComponent
          options={tags.map((item) => ({
            code: item.id || "",
            name: item.name || "",
          }))}
          placeholder="Chọn từ khóa"
          placeholderStyle={{ color: color.textGrey3 }}
          control={props.control}
          errors={props.errors}
          name="tagId"
          filter
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
                placeholder="Mô tả"
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
      </View>
    </ScrollView>
  );
}

export default TopicEditor;
