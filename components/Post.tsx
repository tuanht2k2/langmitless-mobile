import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarComponent from "./Avatar";
import color from "@/assets/styles/color";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { Icon } from "@rneui/themed";
import { useRouter } from "expo-router";
import CommonService from "@/services/CommonService";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/redux/reducers/globalSlide";
import { RootState } from "@/redux/store";
import reactionService from "@/services/reactionService";

export enum EReactionType {
  "LIKE" = "LIKE",
  "LOVE" = "LOVE",
  "SAD" = "SAD",
  "FUNNY" = "FUNNY",
  "ANGRY" = "ANGRY",
}

interface IReaction {
  code: EReactionType | string;
  label?: string;
  icon: string;
  color?: string;
}

const REACTIONS: IReaction[] = [
  {
    code: EReactionType.LIKE,
    icon: "thumb-up",
    color: color.primary,
  },
  {
    code: EReactionType.LOVE,
    icon: "favorite",
    color: color.pink,
  },
  {
    code: EReactionType.FUNNY,
    icon: "mood",
    color: color.warning,
  },
  {
    code: EReactionType.SAD,
    icon: "sentiment-dissatisfied",
    color: color.warning,
  },
  {
    code: "CLEAR",
    icon: "close",
    // color: color.warning,
  },
];

interface IProps {
  post: ResponseInterfaces.IPostResponse;
  reloadPost: () => Promise<void>;
}

const PostComponent: React.FC<IProps> = ({ post, reloadPost }) => {
  const user = useSelector((state: RootState) => state.auth.account);
  const width = Dimensions.get("window").width;
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNavigateAccount = () => {
    router.push(`/account/${post.createdBy?.id}`);
  };

  const handleNavigatePost = () => {
    router.push(`/post/${post.id}`);
  };

  const handleNavigateImage = (uri: string) => {
    const imageName = uri.split("/").pop();
    router.push(`/image/${imageName}`);
  };

  const openCommentModal = () => {
    dispatch(
      openModal({
        type: "COMMENT",
        props: {
          postId: post.id,
        },
      })
    );
  };

  const [reactionLoading, setReactionLoading] = useState<boolean>(false);

  const [reacted, setReacted] =
    useState<ResponseInterfaces.IReactionResponse | null>(null);
  const [reactModalVisible, setReactModalVisible] = useState<boolean>(false);

  const getAccountReacted = (post: ResponseInterfaces.IPostResponse) => {
    return post.reactions?.find((reaction) => {
      return reaction?.createdBy?.id == user?.id;
    });
  };

  const handleUnReact = () => {
    setReactionLoading(true);
    if (reacted?.id) {
      reactionService.delete(reacted?.id).then(() => {
        setReacted(null);
        setReactionLoading(false);
      });
    }
  };

  const handleReact = (reactionType: EReactionType) => {
    setReactionLoading(true);
    const request = { ...reacted, type: reactionType, postId: post.id };
    if (request?.id) {
      reactionService.update(request).then(() => {
        setReacted((prev) => ({ ...prev, type: reactionType }));
        setReactionLoading(false);
      });
    } else {
      reactionService.create(request).then((res) => {
        const reactionId = res?.data?.data;
        setReacted((prev) => ({ ...prev, type: reactionType, id: reactionId }));
        setReactionLoading(false);
      });
    }
  };

  useEffect(() => {
    const reacted = getAccountReacted(post);
    if (reacted) setReacted(reacted);

    return () => {};
  }, [post]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <AvatarComponent
          accountUrl={post.createdBy?.id}
          imageUrl={post.createdBy?.profileImage}
          size={40}
        />
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleNavigateAccount}>
            <Text style={{ fontWeight: "500" }}>
              {post.createdBy?.displayName}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
            }}
          >
            {post.createdAt && (
              <Text style={{ color: color.darkGrey, fontSize: 12 }}>
                {CommonService.getFormattedISO(post.createdAt.toString())}
              </Text>
            )}
            <Icon
              size={15}
              name={
                post.audience === "PUBLIC"
                  ? "public"
                  : post.audience === "PRIVATE"
                  ? "lock"
                  : "group"
              }
              color={color.darkGrey}
            />
          </View>
        </View>
      </View>

      <View style={styles.main}>
        {post.content && <Text style={styles.content}>{post.content}</Text>}
        {post.files?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              if (post.files.length == 1)
                handleNavigateImage(post.files[0].url);
              else handleNavigatePost();
            }}
            style={styles.imageWrapper}
          >
            <Image
              source={{ uri: post.files[0].url }}
              style={{ width: width, height: width }}
            />
            {post.files?.length > 1 && (
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>
                  + {post.files?.length - 1}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        {post.reactions?.length ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon name="recommend" color={color.primary} size={20} />
            <Text>{post.reactions.length}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            setReactModalVisible(true);
          }}
          delayLongPress={100}
          disabled={!!reactionLoading}
        >
          <Modal
            visible={reactModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setReactModalVisible(false);
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: 5,
                    padding: 3,
                    gap: 15,
                  }}
                >
                  {REACTIONS.map((reaction, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          if (reaction.code == "CLEAR") {
                            handleUnReact();
                          } else {
                            handleReact(reaction.code as EReactionType);
                          }
                          setReactModalVisible(false);
                        }}
                        style={{
                          backgroundColor: color.white,
                          borderRadius: 100,
                          padding: 5,
                          borderWidth: 1,
                          borderColor: reaction.color,
                        }}
                      >
                        <Icon name={reaction.icon} color={reaction.color} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          {reactionLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              {!reacted && (
                <>
                  <Icon name="thumb-up" color={color.darkGrey} size={17} />
                  <Text style={styles.footerButtonTitle}>Thích</Text>
                </>
              )}
              {reacted?.type == EReactionType.LIKE && (
                <>
                  <Icon name="thumb-up" color={color.primary} size={20} />
                  <Text
                    style={{
                      ...styles.footerButtonTitle,
                      color: color.primary,
                    }}
                  >
                    Thích
                  </Text>
                </>
              )}
              {reacted?.type == EReactionType.LOVE && (
                <>
                  <Icon name="favorite" color={color.pink} size={20} />
                  <Text
                    style={{ ...styles.footerButtonTitle, color: color.pink }}
                  >
                    Yêu thích
                  </Text>
                </>
              )}
              {reacted?.type == EReactionType.FUNNY && (
                <>
                  <Icon name="mood" color={color.warning} size={20} />
                  <Text
                    style={{
                      ...styles.footerButtonTitle,
                      color: color.warning,
                    }}
                  >
                    Haha
                  </Text>
                </>
              )}
              {reacted?.type == EReactionType.SAD && (
                <>
                  <Icon
                    name="sentiment-dissatisfied"
                    color={color.warning}
                    size={20}
                  />
                  <Text
                    style={{
                      ...styles.footerButtonTitle,
                      color: color.warning,
                    }}
                  >
                    Buồn
                  </Text>
                </>
              )}
            </>
          )}
        </TouchableOpacity>

        {/* <CommentListComponent /> */}
        <TouchableOpacity
          style={styles.footerButton}
          onPress={openCommentModal}
        >
          <Icon name="forum" color={color.grey} size={17} />
          <Text style={styles.footerButtonTitle}>Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="link" color={color.secondary} size={17} />
          <Text style={styles.footerButtonTitle}>Sao chép</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color.lightGrey,
    backgroundColor: color.white,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  headerRight: {
    gap: 4,
  },
  main: { gap: 10 },
  content: { padding: 10 },
  imagesWrapper: {
    // flex: 1,
  },
  imageWrapper: {
    position: "relative",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: color.lightOverlay,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlayText: {
    fontSize: 30,
    color: color.white,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: color.lightGrey,
    borderWidth: 1,
    padding: 5,
  },
  footerButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    // borderWidth: 1,
    borderColor: color.extraLightGrey,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 20,
    flex: 1,
  },
  footerButtonTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: color.grey,
  },
});

export default PostComponent;
