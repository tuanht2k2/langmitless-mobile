import color from "@/assets/styles/color";
import Button from "@/components/Button";
import IconButtonComponent from "@/components/IconButton";
import { Interfaces } from "@/data/interfaces/model";
import { RootState } from "@/redux/store";
import roomService from "@/services/roomService";
import getSocketClient from "@/utils/getSocketClient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from "react-native-webrtc";
import { useSelector } from "react-redux";
import Stomp from "stompjs";

// @ts-ignore
import disconnectIcon from "@/assets/images/icons/disconnect.png";
import ModalComponent from "@/components/Modal";
import hireService from "@/services/hireService";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { RequestInterfaces } from "@/data/interfaces/request";
import CommonService from "@/services/CommonService";
import AvatarComponent from "@/components/Avatar";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function RoomScreen() {
  const { roomId } = useLocalSearchParams();
  const account = useSelector((state: RootState) => state.auth.account);

  const [localStream, setLocalStream] = useState<any | null>(null);
  const [remoteStream, setRemoteStream] = useState<any | null>(null);
  const localPCRef = useRef<RTCPeerConnection | null>(null);
  const socketClientRef = useRef<Stomp.Client | null>(null);

  const [endCall, setEndCall] = useState<boolean>(false);

  useEffect(() => {
    startLocalStream();
  }, []);

  const startLocalStream = async () => {
    try {
      const isFront = true;
      const devices: MediaDeviceInfo[] =
        (await mediaDevices.enumerateDevices()) as MediaDeviceInfo[];

      const facing = isFront ? "front" : "environment";
      const videoSourceId = devices.find(
        (device) =>
          device.kind === "videoinput" &&
          device.label.toLowerCase().includes(facing.toLowerCase())
      );
      const facingMode = isFront ? "user" : "environment";
      const constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500,
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode,
          optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
        },
      };
      const newStream = await mediaDevices.getUserMedia(constraints);
      setLocalStream(newStream);
    } catch (error) {
      console.error("Lỗi khi khởi tạo local stream:", error);
    }
  };

  const handleAnswer = async (data: Interfaces.IWebRTC) => {
    if (
      !data.sdp ||
      !localPCRef.current ||
      localPCRef.current.signalingState !== "have-local-offer"
    ) {
      return;
    }

    try {
      const rtcSessionDescription = new RTCSessionDescription({
        type: "answer",
        sdp: data.sdp,
      });
      await localPCRef.current.setRemoteDescription(rtcSessionDescription);
    } catch (error) {
      console.error("Lỗi khi xử lý answer:", error);
    }
  };

  const handleOffer = async (data: Interfaces.IWebRTC) => {
    if (!socketClientRef.current) {
      return;
    }
    if (!data.sdp || !localPCRef.current) {
      return;
    }
    if (localPCRef.current.signalingState === "have-local-offer") return;
    try {
      const rtcSessionDescription = new RTCSessionDescription({
        type: "offer",
        sdp: data.sdp,
      });
      await localPCRef.current.setRemoteDescription(rtcSessionDescription);
      const answer = await localPCRef.current.createAnswer();
      await localPCRef.current.setLocalDescription(answer);

      const answerData: Interfaces.IWebRTC = {
        roomId: data.roomId,
        type: "answer",
        sdp: localPCRef.current.localDescription?.sdp,
      };

      roomService.sendWebRTCData(answerData, socketClientRef.current);
    } catch (error) {
      console.error("Lỗi xử lý offer:", error);
    }
  };

  const handleCandidate = (data: Interfaces.IWebRTC) => {
    if (data.sdpMLineIndex === null && data.sdpMid === null) return;

    if (!localPCRef.current?.remoteDescription) {
      return;
    }
    try {
      const rtcIceCandidate = new RTCIceCandidate({
        candidate: data.candidate,
        sdpMid: data.sdpMid,
        sdpMLineIndex: data.sdpMLineIndex,
      });
      localPCRef.current?.addIceCandidate(rtcIceCandidate);
    } catch (error) {
      console.error("Lỗi khi xử lý candidate:", error);
    }
  };

  const handleWebRTCData = (data: Interfaces.IWebRTC) => {
    switch (data.type) {
      case "answer":
        handleAnswer(data);
        break;
      case "offer":
        handleOffer(data);
        break;
      case "candidate":
        handleCandidate(data);
        break;
      default:
        return;
    }
  };

  const setUpPeerConnection = async () => {
    try {
      const localPC = new RTCPeerConnection(configuration);

      localStream?.getTracks().forEach((track: any) => {
        localPC.addTrack(track, localStream);
      });

      localPC.addEventListener("track", (e: any) => {
        const newStream = new MediaStream();
        e.streams[0]?.getTracks().forEach((track: any) => {
          newStream.addTrack(track);
        });
        setRemoteStream(newStream);
      });

      localPC.addEventListener("icecandidate", (e) => {
        if (e.candidate) {
          const candidateData: Interfaces.IWebRTC = {
            roomId: roomId as string,
            type: "candidate",
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid || "",
            sdpMLineIndex: e.candidate.sdpMLineIndex || 0,
          };
          if (!socketClientRef.current) return;
          roomService.sendWebRTCData(candidateData, socketClientRef.current);
        }
      });

      localPCRef.current = localPC;
    } catch (error) {
      console.error("Lỗi khi tạo peer connection:", error);
    }
  };

  const startCall = async () => {
    if (!socketClientRef.current) return;
    if (!localPCRef.current) {
      console.error("Khong co local ref");
      return;
    }

    try {
      const offer = await localPCRef.current.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      });
      await localPCRef.current.setLocalDescription(offer);

      const offerData: Interfaces.IWebRTC = {
        roomId: roomId as string,
        type: "offer",
        sdp: offer.sdp,
      };

      roomService.sendWebRTCData(offerData, socketClientRef.current);
    } catch (error) {
      console.error("Lỗi khi tạo peer connection:", error);
    }
  };

  const clearStream = () => {
    if (localPCRef.current) {
      localPCRef.current.close();
      localPCRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track: any) => {
        track.stop();
      });
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track: any) => {
        track.stop();
      });
      setRemoteStream(null);
    }
  };

  useEffect(() => {
    if (!socketClientRef.current) return;
    setUpPeerConnection();

    return () => {
      // clearStream();
    };
  }, [socketClientRef.current]);

  useEffect(() => {
    const socketClient = getSocketClient();
    const topic = `/topic/rooms/${roomId}/video-call`;
    socketClient.connect(
      {},
      () => {
        socketClient.subscribe(topic, (message) => {
          const data = JSON.parse(message.body);
          handleWebRTCData(data);
        });
      },
      (error) => {
        console.error("Error connecting to WebSocket", error);
      }
    );
    socketClientRef.current = socketClient;

    return () => {
      if (socketClient.connected)
        socketClient.disconnect(() => {
          console.log("Web socket disconnected");
        });
    };
  }, []);

  const navigation = useNavigation();

  const [hire, setHire] = useState<ResponseInterfaces.IHireResponse | null>(
    null
  );

  // Handle app state changes
  const handleGetHireDetails = async (id: string) => {
    try {
      const res: ResponseInterfaces.ICommonResponse<ResponseInterfaces.IHireResponse> =
        await hireService.get(id);
      if (res && res.data) setHire(res.data);
    } catch (error) {
      console.error("Error fetching hire details:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      setEndCall(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!roomId) return;
    handleGetHireDetails(roomId as string);

    // const pingInterval = setInterval(() => {}, 10000);

    return () => {
      // clearInterval(pingInterval);
    };
  }, []);

  const getTimeStatus = () => {
    if (!hire || !hire.createdAt || !hire.totalTime || !hire.createdAt)
      return 0; // 0: Lỗi; 1: Dưới 1/3 thời gian; 2: Trên 1/3 thời gian

    const actualTime =
      (new Date().getSeconds() - new Date(hire.createdAt).getSeconds()) / 1000;

    const ratio = actualTime / hire.totalTime;
    return ratio < 0.33 ? 1 : 2;
  };

  const handleConfirmEndCall = async () => {
    try {
      if (!hire) return;

      const request: RequestInterfaces.IEditHireRequest = {
        id: roomId as string,
        status: "ENDED",
      };
      const res: ResponseInterfaces.ICommonResponse<null> =
        await hireService.updateStatus(request);
      if (res.code !== 200) {
        CommonService.showToast("error", res.message);
        return;
      }

      setHire(res.data);
      clearStream();
      if (socketClientRef.current) {
        socketClientRef.current.disconnect(() => {
          console.log("Web socket disconnected");
        });
      }
    } catch (error) {
      console.error("Error when handleConfirmEndCall:", error);
      CommonService.showToast(
        "error",
        "Có lỗi xảy ra trong quá trình kết thúc cuộc gọi. Vui lòng thử lại sau."
      );
    }
  };

  // video call action view
  const [videoCallActionVisible, setVideoCallActionVisible] =
    useState<boolean>(false);

  const toggleVideoCallActionVisible = () => {
    setVideoCallActionVisible((prev) => !prev);
  };

  const VideoCallActionView = () => {
    return (
      <Modal
        visible={videoCallActionVisible}
        animationType="slide"
        transparent
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            height: "100%",
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 10,
              width: "100%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: color.yellow1,
              paddingVertical: 40,
              paddingHorizontal: 15,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <IconButtonComponent
                color={color.blue1}
                image={disconnectIcon}
                onPress={() => {
                  toggleVideoCallActionVisible();
                  setEndCall(true);
                }}
              />
              <IconButtonComponent
                icon="switch-camera"
                iconColor={color.white1}
                color={color.blue1}
              />
              <IconButtonComponent
                icon="brush"
                iconColor={color.white1}
                color={color.blue1}
              />
              <IconButtonComponent
                icon="wifi-calling"
                onPress={startCall}
                iconColor={color.blue1}
              />
            </View>
            <IconButtonComponent
              icon="close"
              onPress={toggleVideoCallActionVisible}
              iconColor={color.blue1}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    // <ImageBackground
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     flexDirection: "row",
    //     height: "100%",
    //     width: "100%",
    //   }}
    //   source={noDataFoundImage}
    // >
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: "100%",
        width: "100%",
        backgroundColor: color.grey1,
      }}
    >
      {remoteStream && localStream && (
        <View
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            backgroundColor: color.red2,
          }}
        >
          <RTCView
            streamURL={remoteStream.toURL()}
            objectFit="cover"
            style={{ height: "100%", width: "100%" }}
          />
          <View
            style={{
              position: "absolute",
              height: 110,
              width: 100,
              top: 10,
              right: 10,
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <RTCView
              streamURL={localStream.toURL()}
              objectFit="cover"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 15,
              }}
            />
          </View>
          <View style={{ position: "absolute", bottom: 30, right: 10 }}>
            <IconButtonComponent
              icon="add"
              color={color.blue1}
              iconColor={color.yellow1}
              onPress={toggleVideoCallActionVisible}
            />
            <VideoCallActionView />
          </View>

          <ModalComponent
            visible={endCall}
            titleStyle={{ color: color.red1 }}
            title="Bạn có chắc chắn muốn kết thúc cuộc gọi không?"
            onClose={() => {
              setEndCall(false);
            }}
          >
            <View
              style={{
                paddingVertical: 24,
                paddingHorizontal: 16,
                gap: 24,
                backgroundColor: "#fff",
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 4,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: color.blue1,
                  fontSize: 22,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Kết thúc cuộc gọi?
              </Text>

              {getTimeStatus() === 1 && (
                <Text
                  style={{
                    color: color.red3,
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: "600",
                    paddingHorizontal: 10,
                  }}
                >
                  Cuộc gọi dưới 1/3 thời gian nên sẽ không được tính phí
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 16,
                  paddingTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={handleConfirmEndCall}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: color.red3,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                  >
                    Xác nhận
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setEndCall(false)}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: color.primary4,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                  >
                    Quay lại
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ModalComponent>
        </View>
      )}
      {hire && hire.status !== "ENDED" && !remoteStream && (
        <View
          style={{
            gap: 14,
            padding: 20,
            backgroundColor: "#f0f8ff",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: color.blue1,
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Bắt đầu cuộc trò chuyện ngay
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <AvatarComponent imageUrl={hire.teacher?.profileImage} size={70} />
            <AvatarComponent
              imageUrl={hire.createdBy?.profileImage}
              size={70}
            />
          </View>

          <TouchableOpacity
            onPress={startCall}
            activeOpacity={0.8}
            style={{
              backgroundColor: color.blue1,
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Bắt đầu
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {hire && hire.status === "ENDED" && (
        <View
          style={{
            gap: 20,
            backgroundColor: "#fff",
            padding: 24,
            borderRadius: 16,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: color.blue1,
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Cuộc gọi đã kết thúc
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <AvatarComponent imageUrl={hire.teacher?.profileImage} size={70} />
            <AvatarComponent
              imageUrl={hire.createdBy?.profileImage}
              size={70}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.replace("/")}
            style={{
              marginTop: 10,
              backgroundColor: color.primary4,
              paddingVertical: 12,
              paddingHorizontal: 28,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* </ImageBackground> */}
    </View>
  );
}

export default RoomScreen;
