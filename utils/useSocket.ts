import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";

const useSocket = (
  topic: string,
  handleSocketData: any,
  onDisconnect?: (data?: any) => void
) => {
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState<Stomp.Client | null>(null);
  useEffect(() => {
    const socketBaseUrl = process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL;
    if (!socketBaseUrl) return;
    const socket = new SockJS(socketBaseUrl);
    const client = Stomp.over(socket);
    client.connect(
      {},
      (frame: any) => {
        setConnected(true);
        client.subscribe(topic, (message) => {
          const data = JSON.parse(message.body);
          handleSocketData(data);
        });
      },
      (error) => {
        console.error("Error connecting to WebSocket", error);
        setConnected(false);
      }
    );
    setClient(client);

    return () => {
      if (client && client.connected) {
        client.disconnect(() => {
          setConnected(false);
          onDisconnect?.();
          console.log("Disconnected");
        });
      }
    };
  }, [topic]);

  return client;
};

export default useSocket;
