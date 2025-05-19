import color from "@/assets/styles/color";
import React, { Fragment, useEffect, useState } from "react";
import { Control, Controller, FieldErrors, useForm } from "react-hook-form";
import { Modal, ScrollView, Text, TextInput, View } from "react-native";
import DropdownComponent from "./Dropdown";
import { ResponseInterfaces } from "@/data/interfaces/response";
import tagService from "@/services/tagService";
import { RequestInterfaces } from "@/data/interfaces/request";
import { useCourse } from "@/contexts";
import GlobalStyle from "@/assets/styles/globalStyles";
import Button from "./Button";
import ModalComponent from "./Modal";
import { LANGUAGES } from "@/constants/constant";
import { useDispatch } from "react-redux";
import { overlayLoaded, overlayLoading } from "@/redux/reducers/globalSlide";
import CommonService from "@/services/CommonService";

interface IProps {
  control: Control<any>;
  errors: FieldErrors<{
    description: string;
    tagId: string;
    courseId: number;
  }>;
}

function TopicEditor(props: IProps) {
  const [tags, setTags] = useState<ResponseInterfaces.ITagResponse[]>([]);
  const [tagVisible, setTagVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      tagName: "",
      tagLanguage: "",
    },
  });

  const dispatch = useDispatch();

  const handleCreateTag = async (data: any) => {
    dispatch(overlayLoading());
    try {
      const request: RequestInterfaces.IEditTagRequest = {
        language: data.tagLanguage,
        name: data.tagName,
      };

      const res: ResponseInterfaces.ICommonResponse<null> =
        await tagService.create(request);
      dispatch(overlayLoaded());

      if (!res || res.code != 200) {
        CommonService.showToast("error", "Đã xảy ra lỗi", res.message);
        return;
      }

      CommonService.showToast("info", "Tạo mới thành công");
      setValue("tagName", "");
      setTagVisible(false);
      searchTags();
    } catch (e) {
      dispatch(overlayLoaded());
      CommonService.showError();
    }
  };

  const { course } = useCourse();

  const searchTags = async () => {
    if (!course) return;

    const request: RequestInterfaces.ISearchTagRequest = {
      name: "",
      language: course.language,
    };
    const res = await tagService.search(request);
    if (res.data && res.data.length > 0) setTags(res.data);
  };

  useEffect(() => {
    searchTags();
  }, []);

  return (
    <ScrollView>
      {!tagVisible && (
        <View style={{ gap: 10 }}>
          <Fragment>
            <View
              style={{
                ...GlobalStyle.horizontalFlex,
                paddingHorizontal: 10,
                justifyContent: "space-between",
              }}
            >
              <Text>Chọn từ khóa</Text>
              <Button
                title="Tạo từ khóa mới"
                textColor={color.textBlue1}
                style={{
                  padding: 8,
                  backgroundColor: color.white1,
                }}
                fontSize={13}
                onClick={() => {
                  setTagVisible(true);
                }}
              />
            </View>
            <DropdownComponent
              options={tags.map((item) => ({
                code: item.id || "",
                name: item.name || "",
              }))}
              placeholder="Từ khóa"
              placeholderStyle={{ color: color.textGrey3 }}
              control={props.control}
              errors={props.errors}
              name="tagId"
              filter
            />
            <Controller
              control={props.control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",

                    flex: 1,
                    borderWidth: 1,
                    borderColor: color.grey1,
                    borderRadius: 7,
                  }}
                >
                  <TextInput
                    placeholder="Mô tả"
                    placeholderTextColor={color.textGrey3}
                    style={[
                      {
                        height: 50,
                        backgroundColor: "#fff",
                        paddingHorizontal: 15,
                        borderRadius: 8,
                        fontSize: 15,
                        flex: 1,
                      },
                    ]}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
          </Fragment>
        </View>
      )}
      <ModalComponent
        visible={tagVisible}
        showHeader
        title="Tạo từ khóa mới"
        onClose={() => {
          setTagVisible(false);
        }}
      >
        <View style={{ gap: 20, padding: 10, marginVertical: 20 }}>
          <Controller
            control={control}
            name="tagName"
            rules={{
              required: "Trường này không được để trống",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  borderRadius: 7,
                  marginVertical: 10,
                }}
              >
                <TextInput
                  placeholder="Tên từ khóa..."
                  placeholderTextColor={color.textGrey3}
                  style={[
                    {
                      height: 50,
                      backgroundColor: color.grey1,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                      fontSize: 15,
                      flex: 1,
                    },
                    {
                      borderColor: errors.tagName
                        ? color.red3
                        : color.transparent,
                      borderWidth: 1,
                      padding: 13,
                      borderRadius: 8,
                    },
                  ]}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          <DropdownComponent
            control={control}
            placeholder="Ngôn ngữ"
            name="tagLanguage"
            options={LANGUAGES}
            placeholderStyle={{ color: color.grey2 }}
          />
          <Button
            style={{ backgroundColor: color.blue1 }}
            title="Tạo mới"
            onClick={handleSubmit(handleCreateTag)}
          />
        </View>
      </ModalComponent>
    </ScrollView>
  );
}

export default TopicEditor;
