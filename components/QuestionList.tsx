import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import {ResponseInterfaces} from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import React from "react";
import {Image, ScrollView, Text, View, ViewStyle} from "react-native";
import {Feather} from "@expo/vector-icons";

interface IProps {
    data: ResponseInterfaces.IQuestionResponse[];
    actionBody?: (item: ResponseInterfaces.IQuestionResponse) => React.ReactNode;
    style?: ViewStyle;
}

function QuestionList(props: IProps) {
    const {data, actionBody} = props;

    return (
        <ScrollView style={{width: "100%"}}>
            <View style={{gap: 5, ...props.style}}>
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
                        <View
                            style={{
                                ...GlobalStyle.horizontalFlex,
                                alignItems: "center",
                                gap: 10,
                                padding: 10,
                                flex: 1,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: color.textMain,
                                    minWidth: 30,
                                }}
                            >
                                {index + 1}.
                            </Text>
                            <View
                                style={{
                                    ...GlobalStyle.horizontalFlex,
                                    alignItems: "center",
                                    gap: 5,
                                    flex: 1,
                                    overflow: "hidden",
                                }}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    {item.type === 'MultipleChoice' ? (
                                        <Feather name="check-circle" size={18} color="blue" style={{marginRight: 8}}/>
                                    ) : (
                                        <Feather name="mic" size={18} color="green" style={{marginRight: 8}}/>
                                    )}
                                    <Text style={{fontSize: 15, maxWidth: 280}}
                                          numberOfLines={1}
                                          ellipsizeMode="tail">{item.content}</Text>
                                </View>
                            </View>
                        </View>
                        {actionBody && actionBody(item)}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default QuestionList;
