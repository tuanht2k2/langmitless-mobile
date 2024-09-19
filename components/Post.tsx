import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarComponent from "./Avatar";
import color from "@/assets/styles/color";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { Icon } from "@rneui/themed";
import { Link, useRouter } from "expo-router";
import CommonService from "@/services/CommonService";
import CommentListComponent from "./CommentList";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/reducers/globalSlide";

const PostComponent: React.FC<ResponseInterfaces.IPostResponse> = (
  post: ResponseInterfaces.IPostResponse
) => {
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
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="thumb-up" color={color.darkGrey} size={17} />
          {/* <Icon name="favorite" />
          <Icon name="mood" />
          <Icon name="sentiment-dissatisfied" /> */}
          <Text style={styles.footerButtonTitle}>Thích</Text>
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
