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
import React, { useEffect, useRef, useState } from "react";
import AvatarComponent from "@/components/Avatar";
import { RootState } from "@/redux/store";
import color from "@/assets/styles/color";
import { ResponseInterfaces } from "@/data/interfaces/response";
import postService from "@/services/postService";
import { RequestInterfaces } from "@/data/interfaces/request";
import PostComponent from "@/components/Post";
import { ActivityIndicator } from "react-native";
import { Icon } from "@rneui/themed";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [request, setRequest] = useState<RequestInterfaces.ISearchPostRequest>({
    page: 0,
    pageSize: 30,
    sortBy: "created_at",
    sortDir: "DESC",
    keyword: "",
  });

  const getData = async () => {
    setIsLoading(true);
    const res = await postService.search(request);
    const data = res.data?.data;
    const posts = data?.list;

    if (posts && posts.length > 0) setPosts(posts);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();

    return () => {};
  }, []);

  const scrollRef = useRef<ScrollView>(null);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);

  const scrollToTop = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ y: 0, animated: true });
  };

  const onScroll = (event: any) => {
    const scrollPositionY = event.nativeEvent.contentOffset.y;
    if (scrollPositionY === 0) {
      getData();
      setIsAtTop(true);
    } else {
      setIsAtTop(false);
    }
  };

  return (
    <View style={styles.bg}>
      <View style={{ marginTop: 10, marginBottom: 0, gap: 5 }}>
        <ScrollView ref={scrollRef} onScroll={onScroll}>
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
            {isLoading ? (
              <ActivityIndicator size={"large"} style={{ marginTop: 30 }} />
            ) : posts && posts.length > 0 ? (
              posts.map((post) => {
                return (
                  <PostComponent
                    key={post.id}
                    post={post}
                    reloadPost={getData}
                  />
                );
              })
            ) : (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  marginTop: 30,
                }}
              >
                <Text>Chưa có bài viết mới</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      {!isLoading && !isAtTop && (
        <TouchableOpacity
          style={{
            borderRadius: 100,
            borderWidth: 3,
            borderColor: color.primary,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            position: "absolute",
            bottom: 10,
            right: 0,
            backgroundColor: color.white,
          }}
          onPress={scrollToTop}
          disabled={isLoading}
        >
          <Icon name="north" size={20} color={color.primary} />
        </TouchableOpacity>
      )}
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
    position: "relative",
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
