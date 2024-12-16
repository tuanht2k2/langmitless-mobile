import { ResponseInterfaces } from "@/data/interfaces/response";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import CommonService from "@/services/CommonService";
import GlobalStyle from "@/assets/styles/globalStyles";
import courseService from "@/services/courseService";
//@ts-ignore
import noResultFoundImg from "@/assets/images/no_result.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { overlayLoading } from "@/redux/reducers/globalSlide";

function Course() {
  const { courseId } = useLocalSearchParams();
  const loading = useSelector((state: RootState) => state.global.isLoading);
  const dispatch = useDispatch();

  const [course, setCourse] =
    useState<ResponseInterfaces.ICourseResponse | null>(null);

  const getDetail = async () => {
    CommonService.dispatchOverlayLoading(dispatch, true);
    try {
      const res = await courseService.get(courseId as string);
      if (res.data) setCourse(res.data);
    } catch (error) {
      CommonService.showToast("error", "Đã xảy ra lỗi!");
    }
    CommonService.dispatchOverlayLoading(dispatch, false);
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <View style={GlobalStyle.background}>
      {!loading && !course && (
        <View style={{ ...GlobalStyle.center, width: "100%", height: "100%" }}>
          <Image
            source={noResultFoundImg}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
      {course && (
        <View style={{ ...GlobalStyle.horizontalFlex }}>
          <Image source={CommonService.getCourseImage(course?.language)} />
        </View>
      )}
    </View>
  );
}

export default Course;
