import React, { useEffect, useState } from "react";
import CourseContext from "./courseContext";
import { ResponseInterfaces } from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import { useDispatch } from "react-redux";
import courseService from "@/services/courseService";

interface IProps {
  children: React.ReactNode;
}

function CourseProvider(props: IProps) {
  const dispatch = useDispatch();

  const [course, setCourse] =
    useState<ResponseInterfaces.ICourseResponse | null>(null);

  const getCourseDetails = async (id: string) => {
    CommonService.dispatchOverlayLoading(dispatch, true);
    try {
      const res = await courseService.get(id);
      if (res.data) setCourse(res.data);
    } catch (error) {
      CommonService.showToast("error", "Đã xảy ra lỗi!");
    }
    CommonService.dispatchOverlayLoading(dispatch, false);
  };

  return (
    <CourseContext.Provider value={{ course, getCourseDetails }}>
      {props.children}
    </CourseContext.Provider>
  );
}

export default CourseProvider;
