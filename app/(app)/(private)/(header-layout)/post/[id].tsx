import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarComponent from "@/components/Avatar";
import color from "@/assets/styles/color";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { Icon } from "@rneui/themed";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import CommonService from "@/services/CommonService";
import { ActivityIndicator } from "react-native";
import postService from "@/services/postService";

const PostDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();

  const width = Dimensions.get("window").width;
  const router = useRouter();

  const [post, setPost] = useState<ResponseInterfaces.IPostResponse | null>(
    null
  );

  const handleNavigateAccount = (id: string) => {
    router.push(`/account/${id}`);
  };

  const handleNavigateImage = (uri: string) => {
    const imageName = uri.split("/").pop();
    router.push(`/image/${imageName}`);
  };

  const getData = async (id: string) => {
    const res = await postService.get(id);
    const post = res.data?.data;
    if (post) setPost(post);
  };

  useEffect(() => {
    getData(id as string);

    return () => {};
  }, []);

  return (
    <View style={styles.wrapper}>
      {post ? (
        <View>
          <View style={styles.header}>
            <AvatarComponent
              accountUrl={post.createdBy?.id}
              imageUrl={post.createdBy?.profileImage}
              size={40}
            />
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => {
                  if (post.createdBy?.id)
                    handleNavigateAccount(post.createdBy.id);
                }}
              >
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
              <ScrollView>
                <View style={{ gap: 5, marginBottom: 220 }}>
                  {post.files.map((file) => (
                    <TouchableOpacity
                      key={file.id}
                      onPress={() => {
                        handleNavigateImage(file.url);
                      }}
                      style={styles.imageWrapper}
                    >
                      <Image
                        source={{ uri: file.url }}
                        style={{
                          height: width,
                          objectFit: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      ) : (
        <View
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color.lightGrey,
    backgroundColor: color.white,
    gap: 10,
    height: "100%",
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
    backgroundColor: color.black,
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
});

export default PostDetailScreen;
