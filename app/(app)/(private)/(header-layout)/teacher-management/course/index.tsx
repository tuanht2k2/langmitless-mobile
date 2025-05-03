import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CourseEditor from "@/components/CourseEditor";
import IconButtonComponent from "@/components/IconButton";
import ModalComponent from "@/components/Modal";
import courseService from "@/services/courseService";

//@ts-ignore
import noResultFoundImg from "@/assets/images/no_result.png";

import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { overlayLoaded, overlayLoading } from "@/redux/reducers/globalSlide";
import { RootState } from "@/redux/store";
import { Icon } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CourseList from "@/components/CourseList";
import CommonService from "@/services/CommonService";
import { useRouter } from "expo-router";

function YourCourseScreen() {
  const account = useSelector((state: RootState) => state.auth.account);
  const loading = useSelector(
    (state: RootState) => state.global.isOverlayLoading
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchName: "",
      name: "",
      description: "",
      cost: "",
      language: "",
      id: "",
      level: 0,
    },
  });

  const [searchRequest, setSearchRequest] =
    useState<RequestInterfaces.ISearchCourseRequest>({
      page: 0,
      pageSize: 1000,
      sortBy: "name",
      sortDir: "ASC",
      keyword: "",
      createdBy: account?.id,
    });

  const [courses, setCourses] = useState<ResponseInterfaces.ICourseResponse[]>(
    []
  );

  const getData = useCallback(
    async (request: RequestInterfaces.ISearchCourseRequest) => {
      try {
        dispatch(overlayLoading());
        const res = await courseService.search(request);
        if (res.data && res.data.length > 0) setCourses(res.data);
        dispatch(overlayLoaded());
      } catch (error) {
        dispatch(overlayLoaded());
        throw error;
      }
    },
    []
  );

  const onSearchSubmit = (data: any) => {
    setSearchRequest((prev) => ({ ...prev, keyword: data.searchName }));
  };

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const toggleModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

  const onCourseSubmit = async (data: any) => {
    dispatch(overlayLoading());
    try {
      const request: RequestInterfaces.IEditCourseRequest = {
        id: data.id,
        name: data.name,
        cost: data.cost,
        description: data.description,
        language: data.language,
        level: data.level,
      };
      const res = data.id
        ? await courseService.edit(request)
        : await courseService.create(request);
      CommonService.showToast("success", "Thành công");
      reset();
      setModalVisible(false);
      setSearchRequest((prev) => ({ ...prev }));
    } catch (error) {
      CommonService.showToast("error", "Đã xảy ra lỗi!");
    }
    dispatch(overlayLoaded());
  };

  const actionBody = (data: ResponseInterfaces.ICourseResponse) => {
    return (
      <View style={{ ...GlobalStyle.horizontalFlex, gap: 3 }}>
        <IconButtonComponent
          icon="edit"
          size={18}
          iconColor={color.primary3}
          onPress={() => {
            setValue("id", data.id || "");
            setValue("cost", data.cost?.toString() || "");
            setValue("description", data.description || "");
            setValue("language", data.language || "");
            setValue("name", data.name || "");
            setValue("level", data.level || 0);
            toggleModal();
          }}
        />
        <IconButtonComponent
          icon="visibility"
          size={18}
          iconColor={color.pink3}
          onPress={() => {
            router.push(`/course/${data.id}`);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    getData(searchRequest);
  }, [searchRequest]);

  return (
    <View
      style={{ padding: 10, backgroundColor: color.background, height: "100%" }}
    >
      <Card styles={{ ...GlobalStyle.center, marginBottom: loading ? 27 : 38 }}>
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
            name="searchName"
            render={({ field: { onChange, onBlur, value } }) => (
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
                  placeholder="Tên khóa học"
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
                  onPress={handleSubmit(onSearchSubmit)}
                />
              </View>
            )}
          />

          <Button
            title="Thêm mới"
            onClick={() => {
              reset();
              toggleModal();
            }}
          />
        </View>
        {!loading && (
          <Text style={{ padding: 5, width: "100%" }}>
            Tất cả: {courses.length}
          </Text>
        )}
        {!loading && courses.length === 0 && (
          <Image
            source={noResultFoundImg}
            style={{ height: 200, width: 200 }}
          />
        )}
        {courses.length > 0 && (
          <CourseList
            data={courses}
            style={{ padding: 5 }}
            actionBody={actionBody}
          />
        )}
      </Card>
      <ModalComponent
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        showHeader
        icon="school"
        title={watch("id") ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
      >
        <View style={{ padding: 14, gap: 10 }}>
          <CourseEditor control={control} errors={errors} />
          <Button title="Lưu" onClick={handleSubmit(onCourseSubmit)} />
        </View>
      </ModalComponent>
    </View>
  );
}

export default YourCourseScreen;
