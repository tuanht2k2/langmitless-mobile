import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {ResponseInterfaces} from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import courseService from "@/services/courseService";
import QuestionContext from "@/contexts/questionContext/questionContext";

interface IProps {
    children: React.ReactNode;
}

function QuestionProvider(props: IProps) {
    const dispatch = useDispatch();

    const [question, setQuestion] = useState<ResponseInterfaces.IQuestionResponse | null>(null);

    const getQuestionDetails = async (id: string) => {
        CommonService.dispatchOverlayLoading(dispatch, true);
        try {
            const res = await courseService.get(id);
            if (res.data) setQuestion(res.data);
        } catch (error) {
            CommonService.showToast("error", "Đã xảy ra lỗi!");
        }
        CommonService.dispatchOverlayLoading(dispatch, false);
    }
    return (
        <QuestionContext.Provider value={{ question, getQuestionDetails }}>
            {props.children}
        </QuestionContext.Provider>
    )
}

export default QuestionProvider;