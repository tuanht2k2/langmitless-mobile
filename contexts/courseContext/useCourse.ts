import { useContext } from "react";
import CourseContext, { ICourseContext } from "./courseContext";

const useCourse = (): ICourseContext => {
  return useContext(CourseContext);
};

export default useCourse;
