import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useRouter} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import {RequestInterfaces} from "@/data/interfaces/request";
import {ResponseInterfaces} from "@/data/interfaces/response";
import {overlayLoaded, overlayLoading} from "@/redux/reducers/globalSlide";
import courseService from "@/services/courseService";
import {Image, Text, TextInput, View} from "react-native";
import GlobalStyle from "@/assets/styles/globalStyles";
import IconButtonComponent from "@/components/IconButton";
import color from "@/assets/styles/color";
import Card from "@/components/Card";
import Button from "@/components/Button";
import CourseList from "@/components/CourseList";
// @ts-ignore
import noResultFoundImg from "@/assets/images/no_result.png";
import {Feather} from "@expo/vector-icons";


const Topic = () => {

    const account = useSelector((state: RootState) => state.auth.account);
    const loading = useSelector((state: RootState) => state.global.isOverlayLoading
    );
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        defaultValues: {
            searchName: "",
            name: "",
            description: "",
            language: "",
            id: "",
            level: 0,
        },
    });

    const [searchRequest, setSearchRequest] = useState<RequestInterfaces.ISearchCourseRequest>({
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
        setSearchRequest((prev) => ({...prev, keyword: data.searchName}));
    };


    useEffect(() => {
        getData(searchRequest);
    }, [searchRequest]);


    // @ts-ignore
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
                            name="searchName"
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
                            title="Tìm kiếm"
                            onClick={() => {
                                reset();
                            }}
                        />
                    </View>
                    {!loading && (
                        <Text style={{padding: 5, width: "100%"}}>
                            Tất cả: {courses.length}
                        </Text>
                    )}
                    {!loading && courses.length === 0 && (
                        <Image
                            source={noResultFoundImg}
                            style={{height: 200, width: 200}}
                        />
                    )}
                    {courses.length > 0 && (
                        <CourseList
                            data={courses}
                            style={{padding: 1}}
                            actionBody={(item)=>(
                                <Feather
                                    name="chevron-right"
                                    size={22}
                                    color={color.primary3}
                                    style={{ padding: 10 }}
                                    onPress={() => {
                                        router.push(`/topics/${item.id}`);
                                    }}
                                />
                            )}
                        />
                    )}
                </Card>
            </View>
        </>
    );
};
export default Topic;
