import React from "react";
import {Text, TextInput, View, Button, TouchableOpacity} from "react-native";
import {Controller, useForm} from "react-hook-form";
import GlobalStyle from "@/assets/styles/globalStyles";
import color from "@/assets/styles/color";
import * as DocumentPicker from "expo-document-picker";

interface FormData {
    content: string;
    audioSample: any;
}

function QuestionPronunciationEditor() {
    // const {
    //     control,
    //     handleSubmit,
    //     setValue,
    //     watch,
    //     formState: { errors },
    // } = useForm<FormData>({
    //     defaultValues: {
    //         content: "",
    //         audioSample: null,
    //     },
    // });
    //
    // const selectedAudio = watch("audioSample");
    //
    // const pickAudioFile = async () => {
    //     try {
    //         const result = await DocumentPicker.getDocumentAsync({
    //             type: "audio/*",
    //             copyToCacheDirectory: true,
    //             multiple: false,
    //         });
    //
    //         if (!result.canceled && result.assets && result.assets.length > 0) {
    //             const pickedFile = result.assets[0];
    //
    //             const file = {
    //                 uri: pickedFile.uri,
    //                 name: pickedFile.name,
    //                 type: pickedFile.mimeType || "audio/mpeg",
    //             };
    //
    //             setValue("audioSample", file);
    //             console.log("Đã chọn:", file);
    //         }
    //     } catch (error) {
    //         console.error("Lỗi chọn file âm thanh:", error);
    //     }
    // };
    //
    // const onSubmit = (data: FormData) => {
    //     console.log("Form data:", data);

    // };
    return (
        <> </>

        // <View style={{ gap: 15 }}>
        //     <Text style={GlobalStyle.mainText}>Câu hỏi phát âm</Text>
        //
        //     <Controller
        //         control={control}
        //         name="content"
        //         rules={{ required: "Câu hỏi là bắt buộc" }}
        //         render={({ field: { onChange, value } }) => (
        //             <TextInput
        //                 placeholder="Ví dụ: Please pronounce the word 'Hello'"
        //                 style={[
        //                     GlobalStyle.mainText,
        //                     {
        //                         borderColor: errors.content ? "red" : "#ccc",
        //                         borderWidth: 1,
        //                         padding: 10,
        //                         borderRadius: 8,
        //                     },
        //                 ]}
        //                 onChangeText={onChange}
        //                 value={value}
        //             />
        //         )}
        //     />
        //     {errors.content && (
        //         <Text style={{ color: "red" }}>{errors.content.message}</Text>
        //     )}
        //
        //     <TouchableOpacity
        //         onPress={pickAudioFile}
        //         style={{
        //             borderWidth: 1,
        //             borderColor: color.primary1,
        //             padding: 10,
        //             borderRadius: 8,
        //         }}
        //     >
        //         <Text style={{ color: color.primary1 }}>
        //             📁 {selectedAudio ? selectedAudio.name : "Chọn file ghi âm (.mp3)"}
        //         </Text>
        //     </TouchableOpacity>
        //
        //     <Button title="Lưu câu hỏi" onPress={handleSubmit(onSubmit)} />
        // </View>
    );
}

export default QuestionPronunciationEditor;
