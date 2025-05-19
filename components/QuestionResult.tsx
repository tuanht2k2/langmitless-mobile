import React, { useEffect, useState } from "react";

import color from "@/assets/styles/color";
import { QUESTION_TYPE } from "@/constants/enum";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, ViewStyle } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { Audio } from "expo-av";
import { playAudio } from "@/utils/audioUtils";

interface IProps {
  question: ResponseInterfaces.IQuestionResponse;
  index: number;
  style?: ViewStyle;
}

function QuestionResult({ question, index, style }: IProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={{ ...style }}>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}
      >
        <Text
          style={{
            fontWeight: "600",
            textDecorationLine: "underline",
            fontSize: 16,
            color: color.textBlue1,
          }}
        >
          {`Câu ${index}: `}
        </Text>
        <Text
          style={{
            fontWeight: "400",
            textDecorationLine: "none",
            fontSize: 16,
          }}
        >
          {question.content}
        </Text>
      </View>

      {question.type === QUESTION_TYPE.PRONUNCIATION && (
        <View style={{ padding: 10, gap: 12 }}>
          {/* Âm thanh chuẩn */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontWeight: "600", fontSize: 14, color: "#1E3A8A" }}>
              Âm thanh chuẩn:
            </Text>
            <TouchableOpacity
              onPress={() => playAudio(question.audioSample, sound, setSound)}
              style={{
                padding: 8,
                backgroundColor: "#E0F2FE",
                borderRadius: 20,
              }}
            >
              <Ionicons name="play" size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* Âm thanh người dùng */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontWeight: "600", fontSize: 14, color: "#1E3A8A" }}>
              Âm thanh người dùng:
            </Text>
            <TouchableOpacity
              onPress={() => playAudio(question.answerAudio, sound, setSound)}
              style={{
                padding: 8,
                backgroundColor: "#FCE7F3",
                borderRadius: 20,
              }}
            >
              <Ionicons name="play" size={20} color="#DB2777" />
            </TouchableOpacity>
          </View>

          {/* Text mẫu */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#0F172A" }}>
              Văn bản mẫu:
            </Text>
            <Text style={{ fontSize: 14, color: "#334155", marginTop: 4 }}>
              {question.textSample || "Không có"}
            </Text>
          </View>

          {/* Text trả lời */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#0F172A" }}>
              Văn bản bạn đọc:
            </Text>
            <Text style={{ fontSize: 14, color: "#334155", marginTop: 4 }}>
              {question.answer || "Không có"}
            </Text>
          </View>
        </View>
      )}

      {question.type === QUESTION_TYPE.MULTIPLE_CHOICE && question.option && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {question.option.map((option) => (
            <View
              key={option.id}
              style={{
                width: "48%",
                padding: 12,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: option.correct
                  ? color.success3
                  : question.answer == option.content
                  ? color.red3
                  : color.grey1,
                backgroundColor: option.correct
                  ? color.success1
                  : question.answer == option.content
                  ? color.red1
                  : color.grey1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: color.textBlack2,
                  fontWeight: option.correct ? "600" : "400",
                }}
              >
                {option.content}
              </Text>
              {option.correct && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={color.success3}
                />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default QuestionResult;
