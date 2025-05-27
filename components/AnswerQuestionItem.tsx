import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { playAudio } from "@/utils/audioUtils";
import color from "@/assets/styles/color";

interface AnswerQuestionItemProps {
  item: ResponseInterfaces.IQuestionResponse;
  index: number;
  selectedOption?: string | null;
  recording?: boolean;
  audioUri?: string | null;
  playbackSound: Audio.Sound | null;
  hasChecked?: boolean;
  pronunciationResult?: {
    pronunciationScore?: number;
    score?: number;
  } | null;
  questionScores: Record<
    string,
    { pronunciationScore?: number; score?: number }
  >;
  handleSelectOption: (
    questionId: string | undefined,
    optionId: string
  ) => void;
  startRecording?: () => void;
  stopRecording?: () => void;
  handleGoToPrev?: () => void;
  handleCheckAnswer?: () => void;
  setPlaybackSound: React.Dispatch<React.SetStateAction<Audio.Sound | null>>;
  isLastQuestion?: boolean;
}

const AnswerQuestionItem: React.FC<AnswerQuestionItemProps> = ({
  item,
  index,
  selectedOption,
  recording,
  audioUri,
  playbackSound,
  hasChecked,
  isLastQuestion,
  handleSelectOption,
  startRecording,
  stopRecording,
  handleGoToPrev,
  handleCheckAnswer,
  setPlaybackSound,
  questionScores,
}) => {
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        padding: 24,
        marginHorizontal: 16,
        minHeight: 400,
        justifyContent: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#f0f0f0",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#333",
          marginBottom: 20,
          lineHeight: 24,
        }}
      >
        Câu {index + 1}: {item.content}
      </Text>

      {(hasChecked || questionScores[item.id as string]) && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#f8f9fa",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {item.type === "Pronunciation" ? (
            <>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#6c757d" }}>
                  Phát âm đúng
                </Text>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#28a745" }}
                >
                  {(
                    questionScores[item.id as string]?.pronunciationScore || 0
                  ).toFixed(1)}
                  %
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#6c757d" }}>
                  Điểm phát âm
                </Text>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#007bff" }}
                >
                  {(questionScores[item.id as string]?.score || 0).toFixed(1)}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#6c757d" }}>
                  Điểm câu này
                </Text>
                <Text
                  style={{ fontSize: 22, fontWeight: "bold", color: "#007bff" }}
                >
                  {(questionScores[item.id as string]?.score || 0).toFixed(1)} /
                  10
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {item.type === "Pronunciation" && (
        <View style={{ marginVertical: 10 }}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 16,
              color: "#555",
              lineHeight: 22,
            }}
          >
            {item.content}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {/* {item.audioSample && (
              <TouchableOpacity
                onPress={() => playAudio(item.audioSample, sound, setSound)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: "#4CAF50",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  minHeight: 44,
                }}
              >
                <Ionicons
                  name="play"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Nghe mẫu
                </Text>
              </TouchableOpacity>
            )} */}

            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: recording ? "#F44336" : "#2196F3",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                minHeight: 44,
              }}
            >
              <Ionicons
                name={recording ? "stop" : "mic"}
                size={16}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {recording ? "Dừng ghi âm" : "Ghi âm"}
              </Text>
            </TouchableOpacity>

            {audioUri && (
              <TouchableOpacity
                onPress={() =>
                  playAudio(audioUri, playbackSound, setPlaybackSound)
                }
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: "#8BC34A",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  minHeight: 44,
                }}
              >
                <Ionicons
                  name="play-circle"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Nghe lại
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {item.type === "MultipleChoice" && (
        <View style={{ marginVertical: 10 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {item.option?.map((option) => {
              const isSelected = selectedOption === option.content;
              const isCorrect = option.correct;
              const isAnswerWrong = hasChecked && isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleSelectOption(item.id, option.content)}
                  style={{
                    width: "48%",
                    marginBottom: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderWidth: 1.5,
                    borderColor: isAnswerWrong
                      ? "#f44336"
                      : isSelected
                      ? "#2196F3"
                      : "#e0e0e0",
                    backgroundColor: isAnswerWrong
                      ? "#FFEBEE"
                      : isSelected
                      ? "#E3F2FD"
                      : "#fff",
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: 22,
                      width: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: isAnswerWrong
                        ? "#f44336"
                        : isSelected
                        ? "#2196F3"
                        : "#9E9E9E",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          height: 12,
                          width: 12,
                          borderRadius: 6,
                          backgroundColor: isAnswerWrong
                            ? "#f44336"
                            : "#2196F3",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: isAnswerWrong
                        ? "#f44336"
                        : isSelected
                        ? "#2196F3"
                        : "#424242",
                      flexShrink: 1,
                    }}
                  >
                    {option.content}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 24,
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={handleGoToPrev}
          disabled={index === 0}
          style={{
            flex: 1,
            backgroundColor: index === 0 ? "#E0E0E0" : "#9E9E9E",
            paddingVertical: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: index === 0 ? 0.7 : 1,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={16}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#fff", fontWeight: "600" }}>Quay lại</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={handleCheckAnswer}
          style={{
            flex: 1,
            paddingVertical: 12,
            backgroundColor: "#FF9800",
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="checkmark-circle"
            size={16}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#fff", fontWeight: "600" }}>Kiểm tra</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={handleCheckAnswer}
          style={{
            flex: 1,
            paddingVertical: 12,
            backgroundColor: isLastQuestion ? color.blue1 : color.success3,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ color: color.white1, fontWeight: "600", marginRight: 8 }}
          >
            {isLastQuestion ? "Nộp bài" : "Trả lời"}
          </Text>
          <Ionicons
            name={isLastQuestion ? "home" : "arrow-forward"}
            size={16}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(AnswerQuestionItem);
