import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";

export const pickAudioFile = async (
  onPicked: (audio: { uri: string; name: string; type: string }) => void
) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
      const audio = {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "audio/mpeg",
      };

      onPicked(audio);
    }
  } catch (error) {
    console.error("Lỗi khi chọn file âm thanh:", error);
  }
};

export const playAudio = async (
  uri: string | null | undefined,
  currentSound: Audio.Sound | null,
  setSound: (sound: Audio.Sound) => void
) => {
  try {
    if (!uri) {
      console.warn("URI audio not valid!");
      return;
    }

    if (currentSound) {
      await currentSound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );

    setSound(newSound);
  } catch (error) {
    console.error("Lỗi khi phát audio:", error);
  }
};
