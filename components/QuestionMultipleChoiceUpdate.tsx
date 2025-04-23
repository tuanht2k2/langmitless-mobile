import React, {useEffect, useState} from "react";
import {Button, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import GlobalStyle from "@/assets/styles/globalStyles";
import {CheckBox} from "@rneui/base";
import {ResponseInterfaces} from "@/data/interfaces/response";
import {RequestInterfaces} from "@/data/interfaces/request";
import {Controller, useForm} from "react-hook-form";
import {Feather} from "@expo/vector-icons";

interface IProps {
    question?: ResponseInterfaces.IQuestionResponse[] | null;
    onBack: () => void;
    onSubmit: (data: RequestInterfaces.IMultipleChoiceRequestUpdate) => void;

}

function QuestionMultipleChoiceUpdate({question, onBack, onSubmit}: IProps) {
    const { control, handleSubmit, setValue } = useForm<RequestInterfaces.IMultipleChoiceRequestUpdate>();
    const [options, setOptions] = useState<RequestInterfaces.IOptionRequest[]>([]);

    useEffect(() => {
        if (question && question.length > 0) {
            const q = question[0];
            setValue("content", q.content || "");
            setOptions(
                q.option?.map(opt => ({
                    content: opt.content,
                    correct: opt.correct,
                })) || []
            );
        }
    }, [question]);

    const handleToggleCorrect = (index: number) => {
        const updated = [...options];
        updated[index].correct = !updated[index].correct;
        setOptions(updated);
    };

    const handleOptionChange = (index: number, value: string) => {
        const updated = [...options];
        updated[index].content = value;
        setOptions(updated);
    };

    const handleDeleteOption = (index: number) => {
        const updated = options.filter((_, idx) => idx !== index); // Loại bỏ option tại index
        setOptions(updated);
    };

    const handleFormSubmit = (data: RequestInterfaces.IMultipleChoiceRequestUpdate) => {
        console.log("Dữ liệu submit:", data, options);
        onSubmit({
            ...data,
            options,
            type: "MultipleChoice",
        });
    };
    return (
        <ScrollView>
            <View style={{ padding: 15, gap: 10 }}>
                <Text style={[GlobalStyle.mainText, { fontWeight: "bold" }]}>Câu hỏi:</Text>
                <Controller
                    control={control}
                    name="content"
                    rules={{ required: "Câu hỏi là bắt buộc" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Nhập nội dung câu hỏi"
                            value={value}
                            onChangeText={onChange}
                            style={GlobalStyle.mainText}
                        />
                    )}
                />

                <Text style={[GlobalStyle.mainText, { fontWeight: "bold", marginTop: 10 }]}>
                    Các đáp án:
                </Text>
                {options.map((option, index) => (
                    <View key={index} style={{ marginVertical: 5 }}>
                        <TextInput
                            value={option.content}
                            onChangeText={(text) => handleOptionChange(index, text)}
                            placeholder={`Đáp án ${index + 1}`}
                            style={GlobalStyle.mainText}
                        />
                        <View style={{ flexDirection: "row", alignItems: "center"}}>
                            <CheckBox
                                checked={option.correct}
                                onPress={() => handleToggleCorrect(index)}
                            />
                            <Text style={{paddingRight:15}}>Đúng</Text>
                            <TouchableOpacity
                                onPress={() => handleDeleteOption(index)}
                            >
                                <Feather name="trash-2" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View
                  style={{
                      marginTop: 20,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                  }}
                >
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Button title="Lưu" onPress={handleSubmit(handleFormSubmit)} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button title="Quay lại" onPress={onBack} color="#ccc" />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default QuestionMultipleChoiceUpdate;
