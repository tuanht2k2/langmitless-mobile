import React, {useEffect, useState} from "react";
import {Image, ScrollView, Text, TextInput, View} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useCourse} from "@/contexts";
import GlobalStyle from "@/assets/styles/globalStyles";
import Card from "@/components/Card";
import color from "@/assets/styles/color";
import {RequestInterfaces} from "@/data/interfaces/request";
import {Controller, useForm} from "react-hook-form";
import IconButtonComponent from "@/components/IconButton";
import Button from "@/components/Button";
// @ts-ignore
import noResultFoundImg from "@/assets/images/no_result.png";
import TopicListByCourse from "@/components/TopicListByCourse";
import {Feather} from "@expo/vector-icons";

function Topics() {
    const {topicsId} = useLocalSearchParams();
    const loading = useSelector((state: RootState) => state.global.isLoading);
    const {course, getCourseDetails} = useCourse();
    const router = useRouter();

    useEffect(() => {
        getCourseDetails(topicsId as string);
    }, []);

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
    });
    const onSearchSubmit = (data: any) => {
        setSearchRequest((prev) => ({...prev, keyword: data.searchName}));
    };
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
                                        placeholder="Tên chủ đề"
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
                            Tất cả: {course?.topics?.length}
                        </Text>
                    )}
                    {!loading && course?.topics?.length === 0 && (
                        <Image
                            source={noResultFoundImg}
                            style={{height: 200, width: 200}}
                        />
                    )}
                    {course?.topics && course.topics.length > 0 ? (
                        <TopicListByCourse
                            data={course.topics}
                            style={{padding:1}}
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
                    ) : (
                        <Text>Không có chủ đề nào.</Text>
                    )}
                </Card>
            </View>
        </>
    );
}
export default Topics;
