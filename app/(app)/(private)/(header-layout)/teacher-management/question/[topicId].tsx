import {ResponseInterfaces} from "@/data/interfaces/response";
import React, {useCallback, useEffect, useState} from "react";
import {View, Text, TextInput, ViewStyle} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useLocalSearchParams} from "expo-router";
import {RequestInterfaces} from "@/data/interfaces/request";
import {overlayLoaded, overlayLoading} from "@/redux/reducers/globalSlide";
import questionService from "@/services/questionService";
import color from "@/assets/styles/color";
import Card from "@/components/Card";
import GlobalStyle from "@/assets/styles/globalStyles";
import {Controller, useForm} from "react-hook-form";
import IconButtonComponent from "@/components/IconButton";
import Button from "@/components/Button";
import QuestionList from "@/components/QuestionList";
import {Feather} from "@expo/vector-icons";
import ModalComponent from "@/components/Modal";
import CommonService from "@/services/CommonService";
import QuestionEditor from "@/components/QuestionEditor";
import QuestionMultipleChoiceUpdate from "@/components/QuestionMultipleChoiceUpdate";
import QuestionPronunciationUpdate from "@/components/QuestionPronunciationUpdate";

interface IProps {
  data: ResponseInterfaces.ITopicResponse[];
  editable?: boolean;
  style?: ViewStyle;
}

function YourQuestionScreen(props: IProps) {
  const {topicId} = useLocalSearchParams();
  const loading = useSelector((state: RootState) => state.global.isOverlayLoading);
  const dispatch = useDispatch();
  const [questions, setQuestion] = useState<ResponseInterfaces.IQuestionResponse[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<ResponseInterfaces.IQuestionResponse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPronounceModalVisible, setIsPronounceModalVisible] = useState(false);
  const [editQuestion, setEditQuestion] = useState<ResponseInterfaces.IQuestionResponse | null>(null);
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
          setQuestion(res.data)
          setFilteredQuestions(res.data);
        }
        dispatch(overlayLoaded())
      } catch (error) {
        console.error("Error fetching questions:", error);
        dispatch(overlayLoaded());
        throw error;
      }
    },
    []
  )
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const handleSearchSubmit = () => {
    const keyword = watch("content");
    setSearchRequest((prevRequest) => ({
      ...prevRequest,
      keyword: keyword ?? "",
    }));


    const filtered = questions.filter((question) =>
      question.content?.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredQuestions(filtered);
  };
  const handleDeleteQuestion = async (questionId: string | undefined) => {
    if (!questionId) return;

    try {
      dispatch(overlayLoading());
      await questionService.deleteQuestion(questionId);
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      setQuestion(updatedQuestions);
      CommonService.showToast("success", "Xoá thành công");
      setFilteredQuestions(updatedQuestions);
    } catch (error) {
      console.error("Failed to delete question:", error);
    } finally {
      dispatch(overlayLoaded());
    }
  };
  const handleUpdateQuestionMultipleChoice = async (questionId: string, updatedData: RequestInterfaces.IMultipleChoiceRequest) => {
    if (!questionId || updatedData.type !== "MultipleChoice") return;

    try {
      dispatch(overlayLoading());

      if (updatedData.type === "MultipleChoice") {
        const multipleChoiceData: RequestInterfaces.IMultipleChoiceRequestUpdate = updatedData as RequestInterfaces.IMultipleChoiceRequestUpdate;
        await questionService.updateQuestionMultipleChoice(questionId, multipleChoiceData);
      }

      CommonService.showToast("success", "Cập nhật thành công");
      await getData(searchRequest);

      setIsEditModalVisible(false);
      setEditQuestion(null);
    } catch (error) {
      console.error("Lỗi cập nhật câu hỏi:", error);
      CommonService.showToast("error", "Có lỗi xảy ra khi cập nhật câu hỏi");
    } finally {
      dispatch(overlayLoaded());
    }
  };

  const handleUpdateQuestionPronunciation = async (
    questionId: string,
    updatedData: RequestInterfaces.IPronunciationRequestUpdate
  ) => {
    if (!questionId) return;
    try {
      dispatch(overlayLoading());
      await questionService.updateQuestionPronunciation(questionId, updatedData);
      CommonService.showToast('success', 'Cập nhật phát âm thành công');
      await getData(searchRequest);
      setIsPronounceModalVisible(false);
      setEditQuestion(null);
    } catch (error) {
      console.error('Lỗi cập nhật phát âm:', error);
      CommonService.showToast('error', 'Có lỗi khi cập nhật phát âm');
    } finally {
      dispatch(overlayLoaded());
    }
  };

  const onEditClick = (q: ResponseInterfaces.IQuestionResponse) => {
    setEditQuestion(q);
    if (q.type === 'Pronunciation') {
      setIsPronounceModalVisible(true);
    } else {
      setIsEditModalVisible(true);
    }
  };


  useEffect(() => {
    getData(searchRequest);
  }, []);


  return (
    <>
      <View
        style={{padding: 10, backgroundColor: color.background, height: "100%"}}
      >
        <Card styles={{...GlobalStyle.center, marginBottom: loading ? 27 : 38}}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <Controller
              control={control}
              name="content"
              render={({field: {onChange, onBlur, value}}) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: 1,
                    borderRadius: 7,
                    borderColor: color.pink2,
                    borderBottomWidth: 1,
                  }}
                >
                  <TextInput
                    placeholder="Tên câu hỏi"
                    placeholderTextColor={color.textGrey4}
                    style={[
                      {
                        borderRadius: 15,
                        paddingLeft: 8,
                        fontSize: 15,
                        flex: 1,
                      },
                    ]}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <IconButtonComponent
                    icon="search"
                    onPress={handleSearchSubmit}
                  />
                </View>
              )}
            />

            <Button
              title="Tìm kiếm"
              onClick={handleSearchSubmit}
            />
          </View>
          {!loading && (
            <Text style={{padding: 5, width: "100%"}}>
              Tất cả: {filteredQuestions.length}
            </Text>
          )}
          <View style={{...GlobalStyle.horizontalFlex, gap: 5}}>
            <Text
              style={{
                ...GlobalStyle.mainText,
                fontSize: 17,
                color: color.pink3,
                fontWeight: "bold",
              }}
            >
              Các câu hỏi
            </Text>
            <IconButtonComponent
              icon="add"
              iconColor={color.blue1}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          </View>
          {filteredQuestions.length > 0 && (
            <QuestionList
              data={filteredQuestions}
              style={{padding: 1}}
              actionBody={(item) => (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                  <Feather
                    name="trash-2"
                    size={20}
                    color="red"
                    onPress={() => handleDeleteQuestion(item.id)}
                  />
                  <Feather
                    name="edit"
                    size={22}
                    color="blue"
                    style={{paddingRight: 10}}
                    onPress={() => {
                      onEditClick(item)
                    }}
                  />
                </View>
              )}
            />
          )}
        </Card>
        <ModalComponent
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
          }}
          icon="help-outline"
          title="Tạo câu hỏi mới"
          showHeader
        >
          <View style={{padding: 10, gap: 10}}>
            <QuestionEditor control={control} errors={errors} onSuccess={() => {
              getData(searchRequest);
              setModalVisible(false);
            }}/>
          </View>
        </ModalComponent>
        <ModalComponent
          visible={isEditModalVisible}
          onClose={() => {
            setIsEditModalVisible(false);
            setEditQuestion(null);
          }}
          icon="help-outline"
          title="Chỉnh sửa câu hỏi"
          showHeader
        >
          <View style={{padding: 10, gap: 10}}>
            <QuestionMultipleChoiceUpdate
              question={editQuestion ? [editQuestion] : []}
              onBack={() => {
                setIsEditModalVisible(false);
                setEditQuestion(null);
              }}
              onSubmit={(updatedData) => handleUpdateQuestionMultipleChoice(editQuestion?.id!, updatedData)}
            />
          </View>
        </ModalComponent>
        <ModalComponent
          visible={isPronounceModalVisible}
          onClose={() => {
            setIsPronounceModalVisible(false);
            setEditQuestion(null);
          }}
          icon="help-outline"
          title="Chỉnh sửa phát âm"
          showHeader
        >
          <View style={{padding: 10, gap: 10}}>
            {editQuestion && (
              <QuestionPronunciationUpdate
                question={editQuestion}
                onBack={() => {
                  setIsPronounceModalVisible(false);
                  setEditQuestion(null);
                }}
                onSubmit={(data) => handleUpdateQuestionPronunciation(editQuestion.id!, data)}
              />
            )}
          </View>
        </ModalComponent>
      </View>
    </>
  )

}

export default YourQuestionScreen;