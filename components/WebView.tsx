import React from "react";
import { WebView } from "react-native-webview";

interface IProps {
  uri: string;
}

function WebViewComponent(props: IProps) {
  return (
    <WebView
      style={{ width: "100%", height: "100%" }}
      source={{ uri: props.uri }}
    />
  );
}

export default WebViewComponent;
