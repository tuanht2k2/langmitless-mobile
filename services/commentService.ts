import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { COMMENT_URL } from "./url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@stomp/stompjs";
import { io } from "socket.io-client";

const commentService = {
  async createSocket(postId: string) {
    const token = await AsyncStorage.getItem("token");

    const socket = io(process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL || "", {
      transports: ["websocket"], // Use only WebSocket (optional but recommended)
      auth: {
        token: `Bearer ${token}`, // Sending the token to the server
      },
      query: {
        postId, // Sending additional data (optional)
      },
    });

    // Handle connection event
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    // Handle incoming messages
    socket.on("message", (data: any) => {
      console.log("Received message from server:", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return socket;
  },
  // async createStompClient(postId: string) {
  //   const token = await AsyncStorage.getItem("token");

  //   const stompClient = new Client({
  //     brokerURL: process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL,
  //     connectHeaders: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     debug: function (str) {},
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //   });

  //   stompClient.onConnect = () => {
  //     console.log("WebSocket connected");

  //     stompClient.subscribe(`/posts/${postId}/comments`, (message) => {
  //       console.log("New comment received: ", message.body);
  //     });

  //     stompClient.publish({
  //       destination: `/app/posts/${postId}/comments`,
  //       body: JSON.stringify({ content: "hello moi nguoi" }),
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   };

  //   stompClient.onStompError = (frame) => {
  //     console.error("STOMP Error: ", frame);
  //   };

  //   stompClient.activate(); // Start the WebSocket connection

  //   return stompClient;
  // },

  async create(request: any) {
    const config = await getApiConfig();

    return ApiInstance.post(COMMENT_URL.BASE, request, config);
  },
  async search(request: RequestInterfaces.ISearchCommentRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(COMMENT_URL.SEARCH, request, config);
  },
  async get(id: string) {
    const config = await getApiConfig();
    return ApiInstance.get(`${COMMENT_URL.BASE}/${id}`, config);
  },
};

export default commentService;
