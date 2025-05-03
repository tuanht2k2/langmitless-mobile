import React from "react";
import {Text, TextInput, View, Button, TouchableOpacity} from "react-native";
import {Controller, useForm} from "react-hook-form";
import GlobalStyle from "@/assets/styles/globalStyles";
import color from "@/assets/styles/color";
import * as DocumentPicker from "expo-document-picker";
import {RequestInterfaces} from "@/data/interfaces/request";
import {pickAudioFile} from "@/utils/audioUtils";


interface IProps {
  onSubmit: (data: RequestInterfaces.IPronunciationRequest) => void;
  onBack: () => void;
}

interface FormData {
  content: string;
  audioSample: any;
}

function QuestionPronunciationEditor({ onSubmit, onBack }: IProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      content: "",
      audioSample: null,
    },
  });

  const selectedAudio = watch("audioSample");

  const onSubmitHandler = async (data: Omit<FormData, "topicId">) => {
    try {
      if (!data.audioSample) {
        console.warn("Chưa chọn file âm thanh");
        return;
      }

      const requestData: RequestInterfaces.IPronunciationRequest = {
        topicId: "",
        content: data.content,
        audioSample: {
          uri: data.audioSample.uri,
          name: data.audioSample.name,
          type: data.audioSample.type,
        },
      };

      onSubmit(requestData);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };



  return (
    <View style={{gap: 15}}>
      <Text style={GlobalStyle.mainText}>Câu hỏi phát âm</Text>

      <Controller
        control={control}
        name="content"
        rules={{required: "Câu hỏi là bắt buộc"}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Ví dụ: Hãy phát âm từ 'Hello' "
            style={[
              GlobalStyle.mainText,
              {
                borderColor: errors.content ? "red" : "#ccc",
                borderWidth: 1,
                padding: 10,
                borderRadius: 8,
              },
            ]}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.content && (
        <Text style={{color: "red"}}>{errors.content.message}</Text>
      )}

      <TouchableOpacity
        onPress={() => pickAudioFile((audio) => setValue("audioSample", audio))}
        style={{
          borderWidth: 1,
          borderColor: color.primary1,
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{color: color.primary1}}>
          {selectedAudio ? selectedAudio.name : "Chọn file ghi âm (.mp3)"}
        </Text>
      </TouchableOpacity>

      <Button title="Lưu câu hỏi" onPress={handleSubmit(onSubmitHandler)}/>
    </View>
  );
}

export default QuestionPronunciationEditor;
