import { logout } from "@/redux/reducers/authSlice";
import { Link, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import AvatarComponent from "@/components/Avatar";
import { RootState } from "@/redux/store";
import color from "@/assets/styles/color";
import { ResponseInterfaces } from "@/data/interfaces/response";
import postService from "@/services/postService";
import { RequestInterfaces } from "@/data/interfaces/request";
import PostComponent from "@/components/Post";

export default function HomeScreen() {
  const account = useSelector((state: RootState) => state.auth.account);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleNavigationCreatePost = () => {
    router.push("/post/create");
  };

  const [posts, setPosts] = useState<ResponseInterfaces.IPostResponse[] | null>(
    null
  );

  const [request, setRequest] = useState<RequestInterfaces.ISearchPostRequest>({
    page: 0,
    pageSize: 30,
    sortBy: "created_at",
    sortDir: "DESC",
    keyword: "",
  });

  const getData = async () => {
    const res = await postService.search(request);
    const data = res.data?.data;
    const posts = data?.list;

    if (posts && posts.length > 0) setPosts(posts);
  };

  useEffect(() => {
    getData();

    return () => {};
  }, []);

  return (
    <View style={styles.bg}>
      <View style={{ marginTop: 10, marginBottom: 0, gap: 5 }}>
        <ScrollView style={{}}>
          <View style={styles.createPostWrapper}>
            <AvatarComponent
              imageUrl={account?.profileImage}
              accountUrl={account?.id}
              size={40}
            />
            <TouchableOpacity
              onPress={handleNavigationCreatePost}
              style={styles.createPostButton}
            >
              <Text>{`${account?.displayName}, bạn đang nghĩ gì?`}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 10 }}>
            {posts && posts.length > 0 ? (
              posts.map((post) => {
                return <PostComponent key={post.id} {...post} />;
              })
            ) : (
              <Text>Chưa có bài viết mới</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {},
  createPostWrapper: {
    marginTop: 5,
    padding: 10,
    paddingVertical: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: color.white,
    shadowColor: color.black,
    shadowOffset: { width: 300, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  createPostButton: {
    fontSize: 17,
    borderRadius: 15,
    padding: 10,
    flex: 1,
    paddingLeft: 20,
    backgroundColor: color.extraLightGrey,
  },
});
