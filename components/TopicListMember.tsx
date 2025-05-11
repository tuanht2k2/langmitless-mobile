import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import React, { useState } from "react";
//@ts-ignore
import noResultFoundImg from "@/assets/images/no_result.png";

import { ResponseInterfaces } from "@/data/interfaces/response";

import { Image, ScrollView, Text, View, ViewStyle } from "react-native";
import { Icon } from "@rneui/themed";
import IconButtonComponent from "./IconButton";
import ModalComponent from "./Modal";
import { useForm } from "react-hook-form";
import TopicEditor from "./TopicEditor";
import { useCourse } from "@/contexts";
import Button from "./Button";
import CommonService from "@/services/CommonService";
import { RequestInterfaces } from "@/data/interfaces/request";
import topicService from "@/services/topicService";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import { CheckBox } from "@rneui/base";

interface IProps {
  data: ResponseInterfaces.ITopicResponse[];
  editable?: boolean;
  style?: ViewStyle;
  onSelectTopic?: (topicId: string | null) => void;
}

function TopicListMember(props: IProps) {
  const dispatch = useDispatch();

  const { style, data, editable } = props;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const { course, getCourseDetails } = useCourse();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseId: "",
      tagId: "",
      description: "",
    },
  });

  const [modalVisible, setModalVisible] = useState(false);

  const onTopicSubmit = async (data: any) => {
    CommonService.dispatchOverlayLoading(dispatch, true);

    if (!course) {
      CommonService.showToast("error", "Lỗi", "Vui lòng thử lại");
      return;
    }
    const request: RequestInterfaces.IEditTopicRequest = {
      ...data,
      courseId: course.id,
    };
    try {
      await topicService.create(request);
      getCourseDetails(course.id || "");
      CommonService.showToast("success", "Thành công", "Tạo chủ đề thành công");
      setModalVisible(false);
      reset();
    } catch (error) {
      CommonService.showToast("error", "Lỗi", "Vui lòng thử lại");
    }

    CommonService.dispatchOverlayLoading(dispatch, false);
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ ...GlobalStyle.horizontalFlex, gap: 5 }}>
        <Icon name="token" color={color.pink3} />
        <Text
          style={{
            ...GlobalStyle.mainText,
            fontSize: 17,
            color: color.pink3,
            fontWeight: "bold",
          }}
        >
          Chủ đề
        </Text>
        {editable && (
          <IconButtonComponent
            icon="add"
            iconColor={color.blue1}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        )}
      </View>
      {data.length > 0 ? (
        <ScrollView style={{ width: "100%" }}>
          <View style={{ gap: 5, ...style }}>
            {data.map((item, index) => (
              <View
                key={index}
                style={{
                  ...GlobalStyle.horizontalFlex,
                  alignItems: "center",
                  gap: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: color.pink1,
                  justifyContent: "space-between",
                }}
              >
                <CheckBox
                  checked={selectedTopicId === item.id}
                  onPress={() => {
                    const newId = selectedTopicId === item.id ? null : item.id!;
                    setSelectedTopicId(newId);
                    props.onSelectTopic?.(newId);
                  }}
                />
                <View
                  style={{
                    ...GlobalStyle.horizontalFlex,
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      ...GlobalStyle.horizontalFlex,
                      alignItems: "center",
                      gap: 5,
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Text
                      style={{
                        ...GlobalStyle.mainText,
                        fontSize: 16,
                        fontWeight: "500",
                        flex: 1,
                      }}
                    >
                      {index + 1}.
                    </Text>
                    <Text
                      style={{
                        ...GlobalStyle.mainText,
                        fontSize: 15,
                        flex: 2,
                      }}
                    >
                      {item.tag?.name}
                    </Text>
                    <Text
                      style={{
                        color: color.textGrey4,
                        fontSize: 15,
                        flex: 4,
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
                {editable && (
                  <View style={{ ...GlobalStyle.horizontalFlex, gap: 3 }}>
                    <IconButtonComponent
                      icon="chevron-right"
                      size={20}
                      iconColor={color.pink3}
                      onPress={() => {
                        router.push(`/teacher-management/question/${item.id}`);
                      }}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={{ width: "100%", ...GlobalStyle.center }}>
          <Image
            source={noResultFoundImg}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
      <ModalComponent
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        // icon="token"
        title="Tạo chủ đề mới"
        showHeader
      >
        <View style={{ padding: 10, gap: 10 }}>
          <TopicEditor control={control} errors={errors} />
          <Button title="Lưu" onClick={handleSubmit(onTopicSubmit)} />
        </View>
      </ModalComponent>
    </View>
  );
}

export default TopicListMember;
