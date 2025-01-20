import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import IconButtonComponent from "@/components/IconButton";
import CommonService from "@/services/CommonService";
import fileService from "@/services/fileService";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import * as FileSystem from "expo-file-system";
import crashService from "@/services/crashService";
import { RequestInterfaces } from "@/data/interfaces/request";

interface IFileResponse {
  id?: string;
  url?: string;
  type?: "MP3" | "MP4" | "DOC" | "RAR" | "IMG";
}

function FileDownload() {
  const dispatch = useDispatch();
  const [files, setFiles] = useState<IFileResponse[]>([]);

  const searchFile = async () => {
    CommonService.dispatchOverlayLoading(dispatch, true);
    try {
      const res = await fileService.search();
      if (res && res.data?.length > 0) setFiles(res.data);
    } catch (error) {
      CommonService.showToast("error", "Đã xảy ra lỗi!");
    }
    CommonService.dispatchOverlayLoading(dispatch, false);
  };

  const downloadFile = async (url?: string) => {
    if (!url) {
      CommonService.showToast("error", "Đã xảy ra lỗi");
      return;
    }
    CommonService.dispatchOverlayLoading(dispatch, true);
    const storage = `${FileSystem.documentDirectory}/files.rar`;
    console.log(storage);

    try {
      const { uri } = await FileSystem.downloadAsync(url, storage);
      CommonService.showToast("success", `File đã được lưu`);
    } catch (error) {
      CommonService.showToast("error", "Đã xảy ra lỗi lúc tải file");
      console.log(error);
    }
    CommonService.dispatchOverlayLoading(dispatch, false);
  };

  const logCrash = async () => {
    try {
      const request: RequestInterfaces.IEditCrashRequest = {
        error: "React native runtime exception",
        type: "CLIENT_ERROR",
      };
      await crashService.create(request);
    } catch (error) {}
    console.error("React native runtime exception");
  };

  useEffect(() => {
    searchFile();
  }, []);

  return (
    <View style={{ ...GlobalStyle.background, padding: 10 }}>
      <View style={{ ...GlobalStyle.horizontalFlex }}>
        <Text style={{ color: color.pink3, fontWeight: "bold" }}>
          Danh sách file
        </Text>
        <IconButtonComponent
          icon="refresh"
          iconColor={color.textPrimary3}
          onPress={searchFile}
        />
        <IconButtonComponent
          icon="download"
          iconColor={color.textPrimary3}
          onPress={logCrash}
        />
      </View>
      <ScrollView style={{ height: "100%", gap: 5 }}>
        <View style={{ gap: 5 }}>
          {files.map((file, index) => (
            <View
              key={index}
              style={{
                ...GlobalStyle.horizontalFlex,
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: color.pink2,
              }}
            >
              <View style={{ ...GlobalStyle.horizontalFlex, flex: 1, gap: 10 }}>
                <Text
                  style={{
                    color: file.type === "RAR" ? color.pink3 : color.primary3,
                  }}
                >
                  {file.type}
                </Text>
                <Text
                  style={{
                    overflow: "hidden",
                    flex: 1,
                    color: color.grey5,
                    fontSize: 12,
                  }}
                >
                  {file.url}
                </Text>
              </View>
              <IconButtonComponent
                icon="download"
                iconColor={color.primary3}
                onPress={() => {
                  downloadFile(file.url);
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default FileDownload;
