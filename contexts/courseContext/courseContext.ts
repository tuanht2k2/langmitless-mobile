import { ResponseInterfaces } from "@/data/interfaces/response";
import { createContext } from "react";

export interface ICourseContext {
  course: ResponseInterfaces.ICourseResponse | null;
  getCourseDetails: (id: string) => void;
  selectMember: (id: string) => void;
  selectedMember?: string;
}

const CourseContext = createContext<ICourseContext>({
  course: null,
  getCourseDetails: () => {},
  selectMember: () => {},
});

export default CourseContext;
