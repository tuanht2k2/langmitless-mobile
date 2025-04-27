// QuestionPronunciationUpdate.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

import {ResponseInterfaces} from "@/data/interfaces/response";
import {RequestInterfaces} from "@/data/interfaces/request";
import GlobalStyle from "@/assets/styles/globalStyles";
import {pickAudioFile, playAudio} from "@/utils/audioUtils";

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



  const onFormSubmit = handleSubmit((data) => {
    if (!audioSample) {
      console.warn('Chưa chọn file audio');
      return;
    }
    onSubmit({ ...data, audioSample });
  });

  return (
    <View style={{ padding: 16 }}>
      { question.audioSample && (
        <View>
          <Text style={[GlobalStyle.mainText, { fontWeight: "bold" }]}>
            File mẫu phát âm:
          </Text>
          <TouchableOpacity
            onPress={() =>
              pickAudioFile((audio) => {
                setAudioSample(audio);
                setValue("audioSample", audio);
              })
            }
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
                  onPress={() =>
                    playAudio(audioSample?.uri || question.audioSample, sound, (newSound) => setSound(newSound))}
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
