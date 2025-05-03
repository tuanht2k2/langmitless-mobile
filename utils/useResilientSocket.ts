import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

const useResilientSocket = (
  topic: string,
  handleSocketData: (data: any) => void,
  onDisconnect?: () => void
) => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Stomp.Client | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 5;

  const connectSocket = () => {
    const socketBaseUrl = process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL;
    if (!socketBaseUrl) return;

    const socket = new SockJS(socketBaseUrl);
    const client = Stomp.over(socket);
    client.debug = (str) => {
      console.log("STOMP DEBUG:", str);
    };

    client.connect(
      {},
      () => {
        console.log("WebSocket connected");
        setConnected(true);
        retryCountRef.current = 0;

        client.subscribe(topic, (message) => {
          const data = JSON.parse(message.body);
          handleSocketData(data);
        });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        setConnected(false);
        if (retryCountRef.current < maxRetries) {
          const delay = Math.pow(2, retryCountRef.current) * 1000; // exponential backoff
          retryCountRef.current += 1;
          console.log(`Retrying connection in ${delay / 1000}s...`);
          setTimeout(connectSocket, delay);
        } else {
          console.log("Max retries reached, giving up.");
        }
      }
    );

    clientRef.current = client;
  };

  const disconnectSocket = () => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.disconnect(() => {
        setConnected(false);
        onDisconnect?.();
        console.log("WebSocket disconnected");
      });
    }
  };

  useEffect(() => {
    connectSocket();

    const appStateListener = AppState.addEventListener(
      "change",
      (nextState) => {
        console.log("return");
        if (
          nextState === "active" &&
          (!clientRef.current || !clientRef.current.connected)
        ) {
          console.log("App returned to foreground, reconnecting WebSocket...");
          connectSocket();
        }
      }
    );

    return () => {
      disconnectSocket();
      appStateListener.remove();
    };
  }, [topic]);

  return { client: clientRef.current, connected };
};

export default useResilientSocket;
