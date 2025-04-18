import color from "@/assets/styles/color";
import React, {useCallback, useState} from "react";
import { Control, FieldErrors } from "react-hook-form";
import {Text, View } from "react-native";
import { RequestInterfaces } from "@/data/interfaces/request";
import QuestionPronunciationEditor from "@/components/QuestionPronunciationEditor";
import QuestionMultipleChoiceEditor from "@/components/QuestionMultipleChoiceEditor";
import {Dropdown} from "react-native-element-dropdown";
import {useDispatch} from "react-redux";
import {overlayLoaded, overlayLoading} from "@/redux/reducers/globalSlide";
import questionService from "@/services/questionService";
import {useLocalSearchParams} from "expo-router";
import CommonService from "@/services/CommonService";

interface IProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    onSuccess: () => void;
}

const questionTypes = [
    { label: "Phát âm (Pronunciation)", value: "Pronunciation" },
    { label: "Trắc nghiệm (Multiple Choice)", value: "MultipleChoice" },
];

function QuestionEditor({ control, errors ,onSuccess }: IProps) {
    const topicId = useLocalSearchParams().topicId as string;

    const [questionType, setQuestionType] = useState<string | null>(null);
    const dispatch = useDispatch();


    const handleQuestionTypeChange = (val: string) => {
        setQuestionType(val);
    };

    const createQuestion = useCallback(
        async (request: RequestInterfaces.IMultipleChoiceRequest) => {
            try {
                const requestData = {
                    ...request,
                    topicId,
                };
                dispatch(overlayLoading());
                 await questionService.createQuestionMultipleChoice(requestData);
                CommonService.showToast("success", "Thành công", "Tạo câu hỏi thành công");
                onSuccess();
                dispatch(overlayLoaded());
            } catch (error) {
                console.error("Lỗi khi tạo câu hỏi:", error);
                dispatch(overlayLoaded());
                throw error;
            }
        },
        [topicId]
    );


    return (
     <>
         <View style={{ gap: 15 }}>
             {!questionType && (
                 <>
                     <Dropdown
                         data={questionTypes}
                         labelField="label"
                         valueField="value"
                         placeholder="Chọn loại câu hỏi"
                         value={questionType}
                         onChange={(item) => {
                             handleQuestionTypeChange(item.value);
                         }}
                     />
                 </>
             )}

             {questionType === "Pronunciation" && (
                 <QuestionPronunciationEditor />
             )}

             {questionType === "MultipleChoice" && (
                 <QuestionMultipleChoiceEditor  onSubmit={createQuestion}  onBack={() => setQuestionType(null)} />
             )}

             {questionType && (
                 <Text
                     style={{ color: color.grey2, textAlign: "center", marginTop: 10 }}
                     onPress={() => setQuestionType(null)}
                 >
                     ← Quay lại chọn loại câu hỏi
                 </Text>
             )}
         </View>
     </>
    );
}

export default QuestionEditor;
