import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useSocket from "@/utils/useSocket";
import { RTCPeerConnection, mediaDevices, RTCView } from "react-native-webrtc";
import { Interfaces } from "@/data/interfaces/model";

function VideoCallComponent() {
  const currentAccount = useSelector((state: RootState) => state.auth.account);

  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [videoCallStatus, setVideoCallStatus] = useState<
    "NONE" | "STARTED" | "STOPPED"
  >("NONE");

  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
  ).current;

  const handleStream = (videoCall: Interfaces.IVideoCall) => {
    if (videoCall.webRTC?.type === "offer") {
      handleIncomingOffer(videoCall);
    } else if (videoCall.webRTC?.type === "answer") {
      handleIncomingAnswer(videoCall);
    } else if (videoCall.webRTC?.type === "candidate") {
      handleIncomingCandidate(videoCall);
    }
  };

  useSocket(`/topic/accounts/${currentAccount?.id}/messengers`, handleStream);

  const startLocalStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      setVideoCallStatus("STARTED");
    } catch (error) {
      console.error("Error accessing local media: ", error);
    }
  };

  const handleIncomingOffer = async (offer: any) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendSignalMessage({ type: "answer", sdp: answer.sdp });
  };

  const handleIncomingAnswer = async (answer: any) => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleIncomingCandidate = async (candidate: any) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const sendSignalMessage = (message: any) => {};

  // peerConnection.onicecandidate = (event) => {
  //   if (event.candidate) {
  //     sendSignalMessage({ type: "candidate", candidate: event.candidate });
  //   }
  // };

  // // Handle remote stream
  // peerConnection.ontrack = (event) => {
  //   if (event.streams && event.streams[0]) {
  //     setRemoteStream(event.streams[0]);
  //   }
  // };

  return (
    <View>
      {videoCallStatus === "NONE" && (
        <Button title="Start Video Call" onPress={startLocalStream} />
      )}
      {videoCallStatus === "STARTED" && (
        <>
          <Text>Video call started</Text>
          {localStream && (
            <RTCView
              streamURL={localStream.toURL()}
              style={{ width: 100, height: 150 }}
            />
          )}
          {remoteStream && (
            <RTCView
              streamURL={remoteStream.toURL()}
              style={{ width: 100, height: 150 }}
            />
          )}
        </>
      )}
      {videoCallStatus === "STOPPED" && <Text>Video call has ended</Text>}
    </View>
  );
}

export default VideoCallComponent;
