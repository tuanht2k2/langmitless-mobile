import color from "@/assets/styles/color";
import Button from "@/components/Button";
import Card from "@/components/Card";
import DropdownComponent from "@/components/Dropdown";
import HorizontalDivider from "@/components/HorizontalDivider";
import { COURSE_LEVELS, COURSE_PRICE, LANGUAGES } from "@/constants/constant";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import courseService from "@/services/courseService";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Image, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";

// @ts-ignore
import emptyIcon from "@/assets/images/no_result.png";
// @ts-ignore
import courseIcon from "@/assets/images/icons/course.png";

import CourseList from "@/components/CourseList";
import IconButtonComponent from "@/components/IconButton";
import GlobalStyle from "@/assets/styles/globalStyles";
import CommonService from "@/services/CommonService";
import {
  askChatbotAboutCourse,
  overlayLoaded,
  overlayLoading,
} from "@/redux/reducers/globalSlide";
import { useRouter } from "expo-router";

function TopicScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      language: "",
      level: null,
    },
  });

  const dispatch = useDispatch();

  const [courses, setCourses] = useState<
    ResponseInterfaces.ICourseResponse[] | null
  >(null);

  const onSubmit = async (data: any) => {
    try {
      dispatch(overlayLoading());
      const request: RequestInterfaces.IStudentSearchCourseRequest = {
        ...data,
      };
      const res: ResponseInterfaces.ICommonResponse<[]> =
        await courseService.studentSearch(request);
      dispatch(overlayLoaded());
      if (res.code != 200) {
        CommonService.showToast("error", "Đã xảy ra lỗi!");
        return;
      }
      if (res.data.length == 0) {
        CommonService.showToast("info", "Không tìm thấy dữ liệu");
      }
      setCourses(res.data);
    } catch (error) {
      console.error("An error occurred when course-onSubmit: ", error);
      CommonService.showToast("error", "Đã xảy ra lỗi!");
      dispatch(overlayLoaded());
    }
  };

  const router = useRouter();

  const actionBody = (data: ResponseInterfaces.ICourseResponse) => {
    return (
      <View style={{ ...GlobalStyle.horizontalFlex, gap: 3 }}>
        <IconButtonComponent
          icon="visibility"
          size={18}
          iconColor={color.pink3}
          onPress={() => {
            router.push(`/course/${data.id}`);
          }}
        />
        <IconButtonComponent
          icon="support-agent"
          size={18}
          iconColor={color.pink3}
          onPress={() => {
            dispatch(askChatbotAboutCourse(data));
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ padding: 10 }}>
      <Card
        styles={{
          borderWidth: 1,
          gap: 10,
          shadowColor: color.blue1,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Image style={{ height: 30, width: 30 }} source={courseIcon} />
          <Text
            style={{
              fontSize: 17,
              color: color.blue1,
              fontWeight: "bold",
            }}
          >
            Tìm kiếm khóa học
          </Text>
        </View>
        <HorizontalDivider />
        <View style={{ paddingTop: 10 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    borderWidth: 1,
                    borderColor: color.blue1,
                    borderRadius: 7,
                    // height: 50,
                  }}
                >
                  <TextInput
                    placeholder="Nhập tên khóa học..."
                    placeholderTextColor={color.textGrey2}
                    style={[
                      {
                        height: "100%",
                        backgroundColor: "#fff",
                        paddingHorizontal: 15,
                        borderRadius: 8,
                        fontSize: 15,
                        flex: 1,
                      },
                      errors.name && { borderColor: "red", borderWidth: 1 },
                    ]}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            <Button
              title="Tìm kiếm"
              style={{ backgroundColor: color.blue1 }}
              textColor={color.yellow2}
              onClick={handleSubmit(onSubmit)}
            />
          </View>
          <DropdownComponent
            options={LANGUAGES}
            placeholder="Chọn ngôn ngữ"
            placeholderStyle={{
              color: color.textGrey2,
              fontSize: 15,
              fontWeight: "500",
            }}
            control={control}
            errors={errors}
            name="language"
            textStyle={{ fontSize: 10 }}
          />
          <DropdownComponent
            options={COURSE_LEVELS}
            placeholder="Chọn cấp độ"
            placeholderStyle={{
              color: color.textGrey2,
              fontSize: 15,
              fontWeight: "500",
            }}
            control={control}
            errors={errors}
            name="level"
          />
          <DropdownComponent
            options={COURSE_PRICE}
            placeholder="Chọn giá tiền"
            placeholderStyle={{
              color: color.textGrey2,
              fontSize: 15,
              fontWeight: "500",
            }}
            control={control}
            errors={errors}
            name="price"
          />
        </View>
      </Card>
      <Card styles={{ marginTop: 20, shadowColor: color.blue1 }}>
        {courses && courses.length > 0 && (
          <CourseList
            data={courses}
            style={{ padding: 5 }}
            actionBody={actionBody}
          />
        )}
        {courses && courses.length == 0 && (
          <View style={{ display: "flex", alignItems: "center" }}>
            <Image source={emptyIcon} style={{ width: 200, height: 200 }} />
          </View>
        )}
        {!courses && (
          <View style={{ display: "flex", alignItems: "center" }}>
            <Text
              style={{ paddingVertical: 20, fontSize: 16, color: color.grey4 }}
            >
              Hãy tìm kiếm gì đó...
            </Text>
            <Image source={emptyIcon} style={{ height: 200, width: 200 }} />
          </View>
        )}
      </Card>
    </View>
  );
}

export default TopicScreen;
