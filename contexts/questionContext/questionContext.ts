import { ResponseInterfaces} from "@/data/interfaces/response";
import {createContext} from "react";



export interface IQuestionContext {
    question: ResponseInterfaces.IQuestionResponse | null;
    getQuestionDetails: (id: string) => void;
}
const QuestionContext = createContext<IQuestionContext>({
    question: null,
    getQuestionDetails: () => {},
});

export default QuestionContext;