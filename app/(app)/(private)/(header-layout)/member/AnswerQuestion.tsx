import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";

function AnswerQuestion() {
  const { topicId } = useLocalSearchParams();

  // Fake danh sách câu hỏi
  const questions = [
    {
      id: "q1",
      questionText: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
    },
    {
      id: "q2",
      questionText: "Which planet is known as the Red Planet?",
      options: ["Earth", "Venus", "Mars", "Jupiter"],
    },
  ];

  const [answers, setAnswers] = useState<{ [key: string]: string | null }>({});

  const handleSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <View style={{ gap: 20 }}>
        {questions.map((question, index) => {
          const selectedOption = answers[question.id];

          return (
            <View
              key={question.id}
              style={{
                borderRadius: 12,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                padding: 16,
                gap: 10,
              }}
            >
              <Text
                style={{
                  ...GlobalStyle.mainText,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: color.textMain,
                }}
              >
                Câu {index + 1}: {question.questionText}
              </Text>

              {question.options.map((option, idx) => {
                const isSelected = selectedOption === option;

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSelect(question.id, option)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      borderColor: isSelected ? color.pink3 : "#ddd",
                      borderRadius: 8,
                      backgroundColor: isSelected ? color.pink1 : "#f9f9f9",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: isSelected ? color.pink3 : "#aaa",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: color.pink3,
                          }}
                        />
                      )}
                    </View>
                    <Text style={{ ...GlobalStyle.mainText, flex: 1 }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default AnswerQuestion;
