import { ComponentInterfaces } from "@/constants/component";
import { RequestInterfaces } from "@/data/interfaces/request";
import { overlayLoaded, overlayLoading } from "@/redux/reducers/globalSlide";
import { RootState } from "@/redux/store";
import topicService from "@/services/topicService";
import React, { useContext, useEffect, useState } from "react";

import { ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "./Tabs";
import { ResponseInterfaces } from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import AvatarComponent from "./Avatar";
import Card from "./Card";
import color from "@/assets/styles/color";
import QuestionResult from "./QuestionResult";
import HorizontalDivider from "./HorizontalDivider";
import { SCORE_COLOR } from "@/constants/constant";
import { Dimensions } from "react-native";
import { useCourse } from "@/contexts";

interface IProps {
  topic: ResponseInterfaces.ITopicResponse;
}

export interface IScoreColor {
  dark: string;
  light: string;
}

const { height } = Dimensions.get("window");

function TopicScore(props: IProps) {
  const account = useSelector((state: RootState) => state.auth.account);
  const { selectedMember } = useCourse();

  const dispatch = useDispatch();

  const [transactionTabs, setTransactionTabs] = useState<
    ComponentInterfaces.ITab[]
  >([]);
  const [activeTransactionIndex, setActiveTransactionIndex] =
    useState<number>(0);

  const [transactionScore, setTransactionScore] =
    useState<ResponseInterfaces.ITransactionScore | null>(null);

  const searchTransactions = async () => {
    dispatch(overlayLoading());
    try {
      const request: RequestInterfaces.ISearchTransactionRequest = {
        userId: selectedMember || account?.id,
        topicId: props.topic.id,
      };

      const res: ResponseInterfaces.ICommonResponse<string[]> =
        await topicService.searchTransactions(request);
      if (res.code != 200 || !res.data) {
        CommonService.showError();
        return;
      }

      setTransactionTabs(
        res.data.map((transactionId, index) => ({
          title: `Lần ${index + 1}`,
          value: transactionId,
        }))
      );
    } catch (error) {
      CommonService.showError();
    } finally {
      dispatch(overlayLoaded());
    }
  };

  const getScoreByTransaction = async () => {
    if (!transactionTabs || transactionTabs.length == 0) return;
    dispatch(overlayLoading());
    try {
      const request: RequestInterfaces.IGetScoreByTransactionRequest = {
        userId: account?.id,
        topicId: props.topic.id,
        transactionId: transactionTabs[activeTransactionIndex].value || "",
      };

      const res: ResponseInterfaces.ICommonResponse<ResponseInterfaces.ITransactionScore> =
        await topicService.getScoreByTransaction(request);
      if (res.code != 200 || !res.data) {
        CommonService.showError();
        return;
      }

      setTransactionScore(res.data);
    } catch (error) {
      CommonService.showError();
    } finally {
      dispatch(overlayLoaded());
    }
  };

  const getScoreColor: (score: number) => IScoreColor = (score: number) => {
    const scoreRank = Math.floor(score / 2);

    return {
      dark: SCORE_COLOR.dark[scoreRank],
      light: SCORE_COLOR.light[scoreRank],
    };
  };

  useEffect(() => {
    searchTransactions();
  }, []);

  useEffect(() => {
    getScoreByTransaction();
  }, [activeTransactionIndex, transactionTabs]);

  return (
    <View style={{ padding: 10, gap: 20 }}>
      {transactionTabs && transactionTabs.length > 0 && (
        <Card>
          <Card>
            <Tabs
              tabs={transactionTabs}
              activeIndex={activeTransactionIndex}
              onChange={setActiveTransactionIndex}
            />
          </Card>
        </Card>
      )}
      {transactionScore && (
        <Card>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: color.pink3,
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              {props.topic.tag?.name}
            </Text>
            <View
              style={{
                padding: 10,
                borderRadius: 70,
                minHeight: 55,
                minWidth: 55,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: getScoreColor(transactionScore.score || 0).dark,
                backgroundColor: getScoreColor(transactionScore.score || 0)
                  .light,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                }}
              >
                {transactionScore.score}
              </Text>
            </View>
            <AvatarComponent imageUrl={account?.profileImage} />
          </View>
          <HorizontalDivider
            style={{
              marginVertical: 10,
            }}
          />
          <ScrollView style={{ maxHeight: height - 400 }}>
            {transactionScore.questions &&
              transactionScore.questions.map(
                (question: ResponseInterfaces.IQuestionResponse, index) => {
                  return (
                    <QuestionResult
                      key={index}
                      question={question}
                      index={index + 1}
                      style={{ paddingVertical: 10 }}
                    />
                  );
                }
              )}
          </ScrollView>
        </Card>
      )}
    </View>
  );
}

export default TopicScore;
