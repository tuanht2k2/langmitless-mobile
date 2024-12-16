import { ComponentInterfaces } from "@/constants/component";
import { LANGUAGES } from "@/constants/constant";
import { Interfaces } from "@/data/interfaces/model";
import { overlayLoaded, overlayLoading } from "@/redux/reducers/globalSlide";
import Toast from "react-native-toast-message";
import { Dispatch, UnknownAction } from "redux";

const CommonService = {
  showToast: (
    type: "success" | "error" | "info",
    text1: string = "",
    text2: string = "",
    autoHide: boolean = true
  ) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      autoHide,
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
  getFormattedISO: (iso: any) => {
    if (!iso) return;
    const date = new Date(iso);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}, lúc ${hours}:${minutes}`;
  },
  stringToDate: (stringDate: string): Date => {
    const [day, month, year] = stringDate.split("/").map(Number);
    return new Date(year, month - 1, day);
  },
  getCourseImage: (code?: string) => {
    if (!code) return;
    return LANGUAGES.find(
      (item: ComponentInterfaces.IDropdownOption<any>) => item.code === code
    )?.img;
  },
  dispatchOverlayLoading: (
    dispatch: Dispatch<UnknownAction>,
    isLoading: boolean
  ) => {
    if (isLoading) {
      dispatch(overlayLoading());
    } else {
      dispatch(overlayLoaded());
    }
  },
};

export default CommonService;
