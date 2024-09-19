import { Interfaces } from "@/data/interfaces/model";
import Toast from "react-native-toast-message";

const CommonService = {
  showToast: (
    type: "success" | "error" | "info",
    text1: string = "",
    text2: string = ""
  ) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
    });
  },
  uriListToFiles: async (
    uriList: string[]
  ): Promise<Interfaces.IMultipartFile[]> => {
    const files = await Promise.all(
      uriList.map(async (uri) => {
        const filename = uri.split("/").pop() || `image_${Date.now()}.jpg`;

        const response = await fetch(uri);
        const blob = await response.blob();

        return { uri, name: filename, type: blob.type };
      })
    );

    return files;
  },
  getFormattedISO: (iso: string) => {
    const date = new Date(iso);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}, lúc ${hours}:${minutes}`;
  },
};

export default CommonService;
