import React, {useEffect, useRef, useState} from "react";
import {Button, ScrollView, Text, TextInput, View} from "react-native";
import {RequestInterfaces} from "@/data/interfaces/request";
import {Controller, useForm} from "react-hook-form";
import {CheckBox, color} from "@rneui/base";
import GlobalStyle from "@/assets/styles/globalStyles";
import {useNavigation} from "expo-router";


interface IProps {
    onSubmit: (data: RequestInterfaces.IMultipleChoiceRequest) => void;
    onBack: () => void;
}

function QuestionMultipleChoiceEditor({onSubmit, onBack}: IProps) {
    const [options, setOptions] = useState<RequestInterfaces.IOptionRequest[]>([{content: "", correct: false}]);
    const {control, handleSubmit, formState: {errors}} = useForm<RequestInterfaces.IMultipleChoiceRequest>();
    const scrollViewRef = useRef<ScrollView>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const addOption = () => {
        if (options.length >= 4) {
            setErrorMessage('Chỉ được tạo tối đa 4 đáp án');
            return;
        }
        setErrorMessage('');
        setOptions((prev) => {
            const newOptions = [...prev, {content: "", correct: false}];
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
            return newOptions;
        });
    };

    const handleOptionChange = (
        index: number,
        field: keyof RequestInterfaces.IOptionRequest,
        value: string | boolean
    ) => {
        const updatedOptions = [...options];

        if (field === "content" && typeof value === "string") {
            updatedOptions[index].content = value;
        } else if (field === "correct" && typeof value === "boolean") {
            updatedOptions[index].correct = value;
        }

        setOptions(updatedOptions);
    };


    const handleFormSubmit = (data: RequestInterfaces.IMultipleChoiceRequest) => {
        const requestData = {
            ...data,
            options,
            type: "MultipleChoice" as const,
        };
        onSubmit(requestData);
    };


    // @ts-ignore
    return (
        <ScrollView ref={scrollViewRef}>
            <View style={{padding: 15, gap: 10}}>
                {/* Câu hỏi */}
                <Controller
                    control={control}
                    name="content"
                    rules={{required: "*Câu hỏi là bắt buộc"}}
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            placeholder="Nhập câu hỏi"
                            style={GlobalStyle.mainText}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.content && (
                    <Text style={{color: "red"}}>
                        {errors.content.message}
                    </Text>
                )}

                {/* Các lựa chọn */}
                {options.map((option, index) => (
                    <View key={index} style={{gap: 5}}>
                        <TextInput
                            placeholder={`Đáp án ${index + 1}`}
                            style={GlobalStyle.mainText}
                            value={option.content}
                            onChangeText={(text) => handleOptionChange(index, "content", text)}
                        />
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <CheckBox
                                checked={option.correct}
                                onPress={() => handleOptionChange(index, "correct", !option.correct)}
                            />
                            <Text>Đúng</Text>
                        </View>
                    </View>

                ))}
                {errorMessage !== '' && <Text style={{color: 'red'}}>{errorMessage}</Text>}
                <View style={{flexDirection: 'row', justifyContent: 'space-around', gap: 10}}>
                    <Button
                        title="Thêm đáp án"
                        color="#4CAF50"
                        onPress={addOption}
                    />
                    <Button
                        title="Lưu câu hỏi"
                        color="#2196F3"
                        onPress={handleSubmit(handleFormSubmit)}
                    />
                    <Button
                        title="Quay lại"
                        color="#FFC107"
                        onPress={onBack}
                    />
                </View>


            </View>
        </ScrollView>


    );
}

export default QuestionMultipleChoiceEditor;
