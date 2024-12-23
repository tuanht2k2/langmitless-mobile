import { ResponseInterfaces } from "@/data/interfaces/response";
import { createContext } from "react";

export interface ICourseContext {
  course: ResponseInterfaces.ICourseResponse | null;
  getCourseDetails: (id: string) => void;
}

const CourseContext = createContext<ICourseContext>({
  course: null,
  getCourseDetails: () => {},
});

export default CourseContext;
