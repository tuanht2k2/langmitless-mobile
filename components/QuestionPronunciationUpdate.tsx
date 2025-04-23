// QuestionPronunciationUpdate.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

import {ResponseInterfaces} from "@/data/interfaces/response";
import {RequestInterfaces} from "@/data/interfaces/request";
import GlobalStyle from "@/assets/styles/globalStyles";

interface IProps {
  question: ResponseInterfaces.IQuestionResponse;
  onBack: () => void;
  onSubmit: (data: RequestInterfaces.IPronunciationRequestUpdate) => void;
}


export default function QuestionPronunciationUpdate({ question, onBack, onSubmit }: IProps) {
  const { control, handleSubmit, setValue } = useForm<RequestInterfaces.IPronunciationRequestUpdate>();
  const [audioSample, setAudioSample] = useState<any>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    // Khởi tạo form với dữ liệu cũ
    setValue('questionId', question.id!);
    setValue('content', question.content || '');
    if (question.audioSample) {
      setAudioSample(question.audioSample);
    }
  }, [question]);

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        setAudioSample({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "audio/mpeg",
        });

        console.log("Đã chọn file mới:", file.uri);
      }
    } catch (error) {
      console.error("Lỗi khi chọn file âm thanh:", error);
    }
  };

  const playAudio = async (uri: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch (error) {
      console.error("Lỗi khi phát audio:", error);
    }
  };


  const onFormSubmit = handleSubmit((data) => {
    if (!audioSample) {
      console.warn('Chưa chọn file audio');
      return;
    }
    onSubmit({ ...data, audioSample });
  });

  return (
    <View style={{ padding: 16 }}>
      {/*<Text style={{ marginBottom: 8 }}>Nội dung câu hỏi</Text>*/}
      { question.audioSample && (
        <View>
          <Text style={[GlobalStyle.mainText, { fontWeight: "bold" }]}>
            File mẫu phát âm:
          </Text>
          <TouchableOpacity
            onPress={pickAudioFile}
            style={{
              borderWidth: 1,
              borderColor: "gray",
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#f9f9f9",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: "gray", flex: 1 }}>
                📁 {audioSample?.name || question.audioSample  || "Chọn file âm thanh mới"}
              </Text>

              {(audioSample?.uri || question.audioSample) && (
                <Button
                  title="▶"
                  onPress={() => playAudio(audioSample?.uri || question.audioSample)}
                />
              )}
            </View>
          </TouchableOpacity>

        </View>
      )}

      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <Button title="Lưu" onPress={onFormSubmit} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Quay lại" onPress={onBack} color="#ccc" />
        </View>
      </View>


    </View>
  );
}
