import QuestionContext, {IQuestionContext} from "@/contexts/questionContext/questionContext";
import {useContext} from "react";


const useQuestion = (): IQuestionContext => {
    return useContext(QuestionContext);
}
export default useQuestion;