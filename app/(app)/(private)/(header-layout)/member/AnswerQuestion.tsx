import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { RequestInterfaces } from "@/data/interfaces/request";
import { overlayLoaded, overlayLoading } from "@/redux/reducers/globalSlide";
import questionService from "@/services/questionService";
import { useDispatch, useSelector } from "react-redux";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { Audio } from "expo-av";
import Carousel from "react-native-reanimated-carousel/src/Carousel";
import answerService from "@/services/answerService";
import AnswerQuestionItem from "@/components/AnswerQuestionItem";
import IAnswerPronunciationScore = ResponseInterfaces.IAnswerPronunciationScore;
import CommonService from "@/services/CommonService";
import color from "@/assets/styles/color";
import { RootState } from "@/redux/store";
import ModalComponent from "@/components/Modal";
import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;
interface IQuestionScoreResult {
  pronunciationScore: number;
  score: number;
}

function AnswerQuestion() {
  const { topicId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [questions, setQuestion] = useState<
    ResponseInterfaces.IQuestionResponse[]
  >([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [hasRecordingPermission, setHasRecordingPermission] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  // @ts-ignore
  const carouselRef = useRef<Carousel<any>>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playbackSound, setPlaybackSound] = useState<Audio.Sound | null>(null);
  const [pronunciationResults, setPronunciationResults] = useState<
    Record<string, IAnswerPronunciationScore>
  >({});
  const [audioUris, setAudioUris] = useState<Record<string, string>>({});
  const [questionScores, setQuestionScores] = useState<
    Record<string, IQuestionScoreResult>
  >({});
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});

  const account = useSelector((state: RootState) => state.auth.account);

  const transactionRef = useRef(account?.id + "_" + new Date().getTime());

  const navigation = useNavigation();

  const [searchRequest, setSearchRequest] =
    useState<RequestInterfaces.IQuestionSearchRequest>({
      page: 0,
      pageSize: 1000,
      sortBy: "name",
      sortDir: "ASC",
      keyword: "",
      topicId: (topicId ?? "") as string,
    });

  const getData = useCallback(
    async (request: RequestInterfaces.IQuestionSearchRequest) => {
      try {
        dispatch(overlayLoading());
        const res = await questionService.getListQuestionByTopic(request);
        if (res.data && res.data.length > 0) {
          setQuestion(res.data);
        }
        dispatch(overlayLoaded());
      } catch (error) {
        console.error("Error fetching questions:", error);
        dispatch(overlayLoaded());
      }
    },
    []
  );

  useEffect(() => {
    getData(searchRequest);
  }, [searchRequest]);

  const handleSelectOption = (
    questionId: string | undefined,
    optionId: string
  ) => {
    if (!questionId) return;
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setHasRecordingPermission(false);
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        const currentQuestionId = questions[activeSlide]?.id;
        if (currentQuestionId) {
          setAudioUris((prev) => ({
            ...prev,
            [currentQuestionId]: uri,
          }));
        }
      }
      setRecording(null);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const handleGoToPrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
      carouselRef.current?.prev();
      setHasChecked(false);
    }
  };

  const [resultVisible, setResultVisible] = useState(false);

  const handleGoToNext = () => {
    if (activeSlide < questions.length - 1) {
      setActiveSlide(activeSlide + 1);
      carouselRef.current?.next();
      setHasChecked(false);
    } else {
      setResultVisible(true);
    }
  };

  const handleCheckAnswer = async () => {
    const currentQuestion = questions[activeSlide];
    dispatch(overlayLoading());

    try {
      if (currentQuestion.type === "Pronunciation") {
        const currentAudioUri = audioUris[currentQuestion.id as string];
        if (!currentAudioUri) {
          dispatch(overlayLoaded());
          CommonService.showToast("error", "Bạn phải ghi âm trước");
          return;
        }
        if (currentAudioUri) {
          const answerRequest: RequestInterfaces.IAnswerQuestionPronunciation =
            {
              topicId: topicId as string,
              questionId: currentQuestion.id as string,
              answerFile: {
                uri: currentAudioUri,
                name: `recording_${Date.now()}.mp3`,
                type: "audio/mp3",
              },
              transactionId: transactionRef.current.toString(),
            };

          await answerService.answerQuestionPronunciation(answerRequest);
        }
      } else if (
        currentQuestion.type === "MultipleChoice" &&
        selectedOptions[currentQuestion.id as string]
      ) {
        const answerRequest: RequestInterfaces.IAnswerQuestionMultipleChoice = {
          topicId: topicId as string,
          questionId: currentQuestion.id as string,
          answeredText: selectedOptions[currentQuestion.id as string],
          transactionId: transactionRef.current.toString(),
        };

        await answerService.answerQuestionMultipleChoice(answerRequest);
      }
      handleGoToNext();
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      dispatch(overlayLoaded());
      setHasChecked(true);
    }
  };

  const renderQuestionItem = ({
    item,
    index,
  }: {
    item: ResponseInterfaces.IQuestionResponse;
    index: number;
  }) => (
    <AnswerQuestionItem
      item={item}
      index={index}
      selectedOption={selectedOptions[item.id as string]}
      recording={recording !== null}
      audioUri={audioUris[item.id as string] || null}
      playbackSound={playbackSound}
      hasChecked={hasChecked || !!questionScores[item.id as string]}
      questionScores={questionScores}
      pronunciationResult={pronunciationResults[item.id as string] || null}
      handleSelectOption={handleSelectOption}
      startRecording={startRecording}
      stopRecording={stopRecording}
      handleGoToPrev={handleGoToPrev}
      handleCheckAnswer={handleCheckAnswer}
      setPlaybackSound={setPlaybackSound}
      isLastQuestion={activeSlide === questions.length - 1}
    />
  );

  return (
    <Fragment>
      {!resultVisible && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: "70%",
              justifyContent: "center",
            }}
          >
            <Carousel
              ref={carouselRef}
              data={questions}
              renderItem={renderQuestionItem}
              width={screenWidth}
              onSnapToItem={(index: React.SetStateAction<number>) =>
                setActiveSlide(index)
              }
              enabled={false}
              style={{
                flex: 1,
              }}
            />
            <View
              style={{
                alignItems: "center",
                paddingVertical: 16,
              }}
            >
              <Text
                style={{ fontSize: 16, color: color.grey4, fontWeight: "400" }}
              >
                Câu {activeSlide + 1}/{questions.length}
              </Text>
            </View>
          </View>
        </View>
      )}
      {resultVisible && (
        <LinearGradient
          colors={[color.primary3, color.accentGold || "#FFD700"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: "100%",
            height: "100%",
            paddingVertical: 32,
            paddingHorizontal: 24,
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: color.textWhite1,
              textAlign: "center",
            }}
          >
            🎉 Chúc mừng bạn!
          </Text>

          <Text
            style={{
              fontSize: 16,
              marginTop: 12,
              color: color.textWhite2,
              textAlign: "center",
            }}
          >
            Bạn đã hoàn thành bài thi. Chúng tôi đang tính điểm cho bạn...
          </Text>

          <ActivityIndicator
            size="large"
            color={color.success3}
            style={{ marginVertical: 20 }}
          />

          <TouchableOpacity
            onPress={() => {
              setResultVisible(false);
              navigation.goBack();
            }}
            style={{
              marginTop: 10,
              backgroundColor: color.accentGold || "#FFD700",
              paddingVertical: 12,
              paddingHorizontal: 32,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: color.textBlack,
              }}
            >
              Xem kết quả
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </Fragment>
  );
}

export default AnswerQuestion;
