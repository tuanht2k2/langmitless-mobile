import React from "react";
import { WebView, WebViewNavigation } from "react-native-webview";

interface IProps {
  uri: string;
  onShouldStartLoadWithRequest?: (event: WebViewNavigation) => boolean;
}

function WebViewComponent(props: IProps) {
  return (
    <WebView
      style={{ width: "100%", height: "100%" }}
      source={{ uri: props.uri }}
      onShouldStartLoadWithRequest={
        props.onShouldStartLoadWithRequest || undefined
      }
    />
  );
}

export default WebViewComponent;
